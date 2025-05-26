import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Table, TableHead, TableRow, TableBody, TableCell } from "../ui/table";
import { GET_ALL_USER_EXCEPT_VERIFIER } from "@/graphql/query/user.query";
import { SAVE_COMMISSION } from "@/graphql/mutation/commission.mutation";
import { GET_COMMISSION } from "@/graphql/query/commission.query";
import { MonthInput, MonthPicker } from "react-lite-month-picker";
import { MonthData } from "@/models/AddOfferModel";
import { useFetchCurrencyRateQuery } from "@/redux/currency/currencyApiSlice";

interface User {
  fullName: string;
  totalSales: number;
}

interface CommissionEntry {
  fullName: string;
  percentage: number;
  rate: number;
  bonus: number;
  total: number;
  currency: string;
  totalSales: number;
  totalReceived: number;
  convertedAmount?: number;
}

const calculateConvertedAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: any
): number => {
  if (!rates?.conversion_rates) return amount;
  
  const fromRate = rates.conversion_rates[fromCurrency] || 1;
  const toRate = rates.conversion_rates[toCurrency] || 1;
  
  return Number((amount * (toRate / fromRate)).toFixed(2));
};

const calculateCommissionTotal = (entry:CommissionEntry,baseCurrency:string,rates:any):number=>{
  const convertedSales = calculateConvertedAmount(entry.totalSales,baseCurrency,entry.currency,rates)
  const commissionAmount = convertedSales * (entry.percentage/100)
  const total = commissionAmount + entry.bonus
  return Number(total.toFixed(2))
}

const calculateTotalReceived = (
  entry: CommissionEntry,
  baseCurrency: string,
  rates: any
): number => {
  // Convert sales to entry currency
  const convertedSales = calculateConvertedAmount(
    entry.totalSales,
    baseCurrency,
    entry.currency,
    rates
  );
  return Number((convertedSales + entry.total).toFixed(2));
};

const calculateRate = (
  fromCurrency: string,
  toCurrency: string,
  rates: any
): number => {
  if (!rates?.conversion_rates) return 1;
  
  const fromRate = rates.conversion_rates[fromCurrency] || 1;
  const toRate = rates.conversion_rates[toCurrency] || 1;
  
  return Number((toRate / fromRate).toFixed(2));
};

// const calculateCommissionTotal = (entry: CommissionEntry): number => {
//   const commissionAmount = (entry.totalSales * entry.rate) * (entry.percentage / 100);
//   const total = commissionAmount  + entry.bonus;
//   return Number(total.toFixed(2));
// };

// const calculateTotalReceived = (entry: CommissionEntry): number => {
//   return Number(((entry.totalSales * entry.rate) + entry.total).toFixed(2));
// };

const Commission = () => {
  const [commissionData, setCommissionData] = useState<CommissionEntry[]>([]);
  const [displayData, setDisplayData] = useState<CommissionEntry[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('NPR');
  console.log(selectedBaseCurrency,"base")

  const { data: currencyRates, isLoading: isLoadingRates } = useFetchCurrencyRateQuery({
    countryCode: "NPR"
  });

  const handleBaseCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBaseCurrency(e.target.value);
    updateCalculations(e.target.value);
  };

  const updateCalculations = (newBaseCurrency: string) => {
    setCommissionData((prevData) => {
      const updatedData = prevData.map(entry => {
        // Update rate when base currency changes
        const newRate = calculateRate(newBaseCurrency, entry.currency, currencyRates);
        
        const convertedAmount = calculateConvertedAmount(
          entry.totalSales,
          newBaseCurrency,
          entry.currency,
          currencyRates
        );

        return {
          ...entry,
          rate: newRate,
          convertedAmount,
          total: calculateCommissionTotal(entry, newBaseCurrency, currencyRates),
          totalReceived: calculateTotalReceived(entry, newBaseCurrency, currencyRates)
        };
      });

      setDisplayData(updatedData);
      return updatedData;
    });
  };

  const { data, loading, refetch } = useQuery(GET_ALL_USER_EXCEPT_VERIFIER, {
    variables: {
      date: new Date(selectedMonth.year, selectedMonth.month - 1).toISOString(),
    },
    notifyOnNetworkStatusChange: true,
  });

  const [saveCommission, { loading: saving }] = useMutation(SAVE_COMMISSION);

  const { data: commissions, loading: loadingCommission, refetch: commissionRefetch } = useQuery(
    GET_COMMISSION,
    {
      variables: {
        date: new Date(selectedMonth.year, selectedMonth.month - 1).toISOString(),
      },
    }
  );

  useEffect(() => {
    refetch({
      date: new Date(selectedMonth.year, selectedMonth.month - 1).toISOString(),
    });
  }, [selectedMonth, refetch]);

  useEffect(() => {
    commissionRefetch({
      date: new Date(selectedMonth.year, selectedMonth.month - 1).toISOString(),
    });
  }, [selectedMonth, commissionRefetch]);

  useEffect(() => {
    if (commissions?.getCommissions?.length > 0) {
      const commissionEntries = commissions.getCommissions.map(
        (commission: any) => ({
          fullName: commission.name,
          percentage: commission.commissionPercent,
          convertedAmount:commission.convertedAmount,
          rate: commission.rate,
          bonus: commission.bonus,
          total: commission.totalCommission,
          currency: commission.currency,
          totalSales: commission.totalSales,
          totalReceived: commission.totalReceivedAmount,
        })
      );
      setDisplayData(commissionEntries);
    } else if (data?.getAllUserExceptVerifier) {
      const initialData = data.getAllUserExceptVerifier.map((user: User) => ({
        fullName: user.fullName,
        percentage: 0,
        rate: 0,
        bonus: 0,
        total: 0,
        currency: selectedBaseCurrency,
        totalSales: user.totalSales || 0,
        totalReceived: user.totalSales || 0,
      }));

      initialData.forEach((entry: CommissionEntry) => {
        const convertedAmount = calculateConvertedAmount(
          entry.totalSales,
          selectedBaseCurrency,
          entry.currency,
          currencyRates
        );
        
        entry.convertedAmount = convertedAmount;
        const fromRate = currencyRates?.conversion_rates?.[selectedBaseCurrency] || 1;
        const toRate = currencyRates?.conversion_rates?.[entry.currency] || 1;
        
        entry.rate = Number((toRate/fromRate).toFixed(2)) ;

        entry.total = calculateCommissionTotal(entry, selectedBaseCurrency, currencyRates);
        entry.totalReceived = calculateTotalReceived(entry, selectedBaseCurrency, currencyRates);
        
      });

      setDisplayData(initialData);
      setCommissionData(initialData);
    }
  }, [data, commissions, currencyRates, selectedBaseCurrency]);

  const handleInputChange = (
    index: number,
    field: keyof CommissionEntry,
    value: string | number
  ) => {
    setCommissionData((prevData) => {
      const updatedData = [...prevData];
      const entry = { ...updatedData[index] };

      if (field === "currency") {
        entry.currency = value as string;
        entry.rate = calculateRate(selectedBaseCurrency, value as string, currencyRates);
      } else if (["percentage", "rate", "bonus"].includes(field)) {
        (entry[field] as number) = Number(value) || 0;
      }

      entry.convertedAmount = calculateConvertedAmount(
        entry.totalSales,
        selectedBaseCurrency,
        entry.currency,
        currencyRates
      );
      entry.total = calculateCommissionTotal(entry, selectedBaseCurrency, currencyRates);
      entry.totalReceived = calculateTotalReceived(entry, selectedBaseCurrency, currencyRates);

      updatedData[index] = entry;
      setDisplayData(updatedData);

      return updatedData;
    });
  };

  if (loading || loadingCommission || isLoadingRates) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

   

  const handleSave = async () => {
    try {
      const input = commissionData.map((entry) => ({
        name: entry.fullName,
        totalSales: entry.totalSales,
        currency: entry.currency,
        commissionPercent: entry.percentage,
        rate: entry.rate,
        bonus: entry.bonus,
        totalCommission: entry.total,
        totalReceivedAmount: entry.totalReceived,
        convertedAmount:entry.convertedAmount
      }));

      const { data } = await saveCommission({
        variables: {
          input,
          commissionDate: new Date(selectedMonth.year, selectedMonth.month - 1).toISOString(),
          baseCurrency:selectedBaseCurrency
        }
      });

      if (data?.saveCommission?.success) {
        alert("Commission data saved successfully!");
        await commissionRefetch();
      } else {
        alert("Failed to save commission data: " + data?.saveCommission?.message);
      }
    } catch (err) {
      console.error("Error saving commission data:", err);
    }
  };

  const renderCurrencySelector = () => {
    if (commissions?.getCommissions?.length > 0) {
      // Display base currency as text when commission data exists
      return (
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Base Currency:</label>
          <span className="border rounded-lg p-2 bg-gray-50">
            {commissions.getCommissions[0].baseCurrency}
          </span>
        </div>
      );
    }

    // Display currency selector when no commission data exists
    return (
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Base Currency:</label>
        <input
          list="currencyOptions"
          value={selectedBaseCurrency}
          onChange={handleBaseCurrencyChange}
          placeholder="Select base currency"
          className="border rounded-lg p-2"
        />
        <datalist id="currencyOptions">
          {currencyRates.conversion_rates && Object.keys(currencyRates.conversion_rates).map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </datalist>
      </div>
    );
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4">
      <div className="flex items-center justify-between p-4">
        <div>
          <div onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <MonthInput
              selected={selectedMonth}
              setShowMonthPicker={setIsPickerOpen}
              showMonthPicker={isPickerOpen}
            />
          </div>
          {isPickerOpen && (
            <div className="relative mt-1">
              <MonthPicker
                setIsOpen={setIsPickerOpen}
                selected={selectedMonth}
                onChange={(data: MonthData) => setSelectedMonth(data)}
              />
            </div>
          )}
        </div>
        
        {/* <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Base Currency:</label>
          <input
            list="currencyOptions"
            value={selectedBaseCurrency}
            onChange={handleBaseCurrencyChange}
            placeholder="Select base currency"
            className="border rounded-lg p-2"
          />
          <datalist id="currencyOptions">
            {currencyRates.conversion_rates && Object.keys(currencyRates.conversion_rates).map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </datalist>
        </div> */}
         {renderCurrencySelector()}
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <TableRow className="bg-gray-100">
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Name</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Total Sales</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Currency</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Converted Amount</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Commission %</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Rate</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Bonus</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Total Commission</TableHead>
              <TableHead className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase w-full">Total Received</TableHead>
            </TableRow>
          </thead>
          <TableBody className="divide-y divide-gray-200">
            {displayData.map((entry, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="px-8 py-4">
                  <input
                    type="text"
                    value={entry.fullName}
                    className="w-full bg-gray-50 border rounded-lg p-2"
                    disabled
                  />
                </TableCell>
                <TableCell className="px-8 py-4">
                  <input
                    type="number"
                    value={entry.totalSales}
                    className="w-full bg-gray-50 border rounded-lg p-2"
                    disabled
                  />
                </TableCell>
                <TableCell className="px-8 py-4">
                  <input
                    list="rowCurrencyOptions"
                    value={entry.currency}
                    onChange={(e) => handleInputChange(index, "currency", e.target.value)}
                    className="w-full border rounded-lg p-2"
                    placeholder="Select currency"
                    disabled ={ commissions?.getCommissions?.length > 0 ? true :false}
                  />
                  <datalist id="rowCurrencyOptions">
                    {currencyRates?.conversion_rates && Object.keys(currencyRates.conversion_rates).map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </datalist>
                </TableCell>
                <TableCell className="px-8 py-4">
                  <p className="text-right font-semibold">
                    {entry.currency} {entry.convertedAmount?.toFixed(2)}
                  </p>
                </TableCell>
                <TableCell className="px-8 py-4">
                  <input
                    type="number"
                    value={entry.percentage}
                    onChange={(e) => handleInputChange(index, "percentage", parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Enter percentage"
                    disabled ={ commissions?.getCommissions?.length > 0 ? true :false}
                  />
                </TableCell>
                <TableCell className="px-8 py-4">
                  <input
                    type="number"
                    value={entry.rate}
                    onChange={(e) => handleInputChange(index, "rate", parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2"
                    min="0"
                    step="0.01"
                    placeholder="Enter rate"
                    disabled ={ commissions?.getCommissions?.length > 0 ? true :false}
                  />
                </TableCell>
                <TableCell className="px-8 py-4">
                  <input
                    type="number"
                    value={entry.bonus}
                    onChange={(e) => handleInputChange(index, "bonus", parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2"
                    min="0"
                    step="0.01"
                    placeholder="Enter bonus"
                    disabled ={ commissions?.getCommissions?.length > 0 ? true :false}
                  />
                </TableCell>
                <TableCell className="px-8 py-4">
                  <p className="text-right font-semibold">
                    {entry.currency} {entry.total.toFixed(2)}
                  </p>
                </TableCell>
                <TableCell className="px-8 py-4">
                  <p className="text-right font-semibold">
                    {entry.currency} {entry.totalReceived.toFixed(2)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {commissions?.getCommissions?.length > 0 ? null : (
          <div className="p-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Data"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Commission;