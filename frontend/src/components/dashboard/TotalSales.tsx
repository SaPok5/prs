import { useState } from "react";
import SalesFilter from "./SalesFilter";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_SALES } from "../../graphql/queries";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgressValue } from "@/lib/calculateProgressValue";
import { useSelector } from "react-redux";
import { selectAuthRole } from "@/redux/auth/authSlice";

interface SalesSummary {
  totalSalesDealValue: number;
  totalPaid: number;
  totalDue: number;
  totalDeals: number;
  pendingDeals: number;
  fullyPaidDeals: number;
  collectionPercentage: number;
  selectedDatePaidAmount: number;
}

interface Metrics {
  dailyAverageDealValue: number;
  dailyAverageCollection: number;
}

interface WorkTypeSales {
  name: string;
  paymentPercentage: number;
  fullyPaidDeals: number;
  averageDealValue: number;
  pendingDeals: number;
  totalSalesDealValue: number;
  totalDeals: number;
}

interface SalesData {
  displayTotalSalesOfMonth?: {
    summary: SalesSummary;
    workTypeSales?: WorkTypeSales[];
    metrics: Metrics;
  };
}

function TotalSales({ allTeams }: any) {
  const role = useSelector(selectAuthRole);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [currentWorkTypeIndex, setCurrentWorkTypeIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState<any>(null);
  const [selectedRange, setSelectedRange] = useState<string>("This Month");

  const {
    loading,
    error,
    data: queryData,
  } = useQuery<SalesData>(GET_TOTAL_SALES, {
    variables: {
      input: {
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        data,
        teamId: role === "admin" ? selectedTeamId : null,
      },
    },
    fetchPolicy:"network-only"
  });

  if (loading)
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading sales data...</p>
      </Card>
    );
  if (error)
    return (
      <Card className="w-full p-4 bg-red-50">
        <CardContent className="text-red-600">
          Error: {error.message}
        </CardContent>
      </Card>
    );

  const handleDateRangeChange = (from: Date, to: Date) => {
    setStartDate(from);
    setEndDate(to);
    setData("customRange");
  };

  const handleRangeSelection = (range: string) => {
    switch (range) {
      case "This Month":
        setStartDate(null);
        setEndDate(null);
        setData("thisMonth");
        break;
      case "Last Month":
        setStartDate(null);
        setEndDate(null);
        setData("lastMonth");
        break;
      case "Last 30 Days":
        setStartDate(null);
        setEndDate(null);
        setData("lastThirty");
        break;
      case "Custom":
        break;
      default:
        break;
    }
  };

  const summary = queryData?.displayTotalSalesOfMonth?.summary;
  const metrics = queryData?.displayTotalSalesOfMonth?.metrics;
  const workTypeSales =
    queryData?.displayTotalSalesOfMonth?.workTypeSales || [];

  const handleNext = () => {
    setCurrentWorkTypeIndex(
      (prevIndex) => (prevIndex + 1) % workTypeSales.length
    );
  };

  const handlePrev = () => {
    setCurrentWorkTypeIndex(
      (prevIndex) =>
        (prevIndex - 1 + workTypeSales.length) % workTypeSales.length
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold"></CardTitle>
        <div className="flex items-center gap-4">
          {role === "admin" && (
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="" disabled>
                Select a team
              </option>
              {allTeams?.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          )}
          <SalesFilter
            onRangeSelect={handleRangeSelection}
            onDateRangeChange={handleDateRangeChange}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-2xl font-bold text-primary">
          Total Sales : $
          {summary?.selectedDatePaidAmount?.toLocaleString() || "0"}
        </div>
        <div className="text-2xl font-bold text-primary">
          Total Deals: {summary?.totalDeals}
        </div>
        <div className="text-2xl font-bold text-primary">
          Daily Total Sales: ${metrics?.dailyAverageCollection}
        </div>

        <hr className="border-gray-300" />
        <div className="space-y-4">
          {[
            {
              label: "Total Paid",
              format: "currency",
              value: summary?.totalPaid,
              outOf: summary?.totalSalesDealValue,
            },
            {
              label: "Total Due",
              format: "currency",
              value: summary?.totalDue,
              outOf: summary?.totalSalesDealValue,
            },
            // { label: "Total Deals", value: summary?.totalDeals },
            {
              label: "Pending Deals",
              format: "deal",
              value: summary?.pendingDeals,
              outOf: summary?.totalDeals,
            },
            {
              label: "Fully Paid Deals",
              format: "deal",
              value: summary?.fullyPaidDeals,
              outOf: summary?.totalDeals,
            },
          ].map(({ label, value, format, outOf }) => (
            <div key={label}>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-medium">
                  {format === "currency"
                    ? `$${value?.toLocaleString() ?? 0} / $${
                        outOf?.toLocaleString() ?? 0
                      }`
                    : format === "deal"
                    ? `${value?.toLocaleString() ?? 0}/${
                        outOf?.toLocaleString() ?? 0
                      }`
                    : null}
                </span>
              </div>
              <Progress
                value={calculateProgressValue(
                  value ?? 0,
                  format === "currency"
                    ? summary?.totalSalesDealValue ?? 0
                    : summary?.totalDeals ?? 0
                )}
                className="h-2 bg-gray-200 [&>div]:bg-blue-500"
              />
            </div>
          ))}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Collection Percentage
              </span>
              <span className="text-sm font-medium">
                {summary?.collectionPercentage?.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={summary?.collectionPercentage || 0}
              className="h-2 bg-gray-200 [&>div]:bg-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold">Work Type Sales</h3>
          {workTypeSales.length > 0 ? (
            <div className="relative">
              <Card className="bg-gray-50">
                <CardContent className="space-y-4 pt-6">
                  <h4 className="font-medium text-lg">
                    {workTypeSales[currentWorkTypeIndex].name}
                  </h4>
                  <p className="text-lg font-bold text-primary">
                    Total Deal Value: $
                    {workTypeSales[
                      currentWorkTypeIndex
                    ].totalSalesDealValue?.toLocaleString() || "0"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Payment Percentage
                      </span>
                      <span className="font-medium">
                        {Number(
                          workTypeSales[currentWorkTypeIndex].paymentPercentage
                        )
                          .toFixed(2)
                          .toLocaleString()}
                        %
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={
                          workTypeSales[currentWorkTypeIndex].paymentPercentage
                        }
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Fully Paid Deals
                      </span>
                      <span className="font-medium">
                        {workTypeSales[currentWorkTypeIndex].fullyPaidDeals} /{" "}
                        {workTypeSales[currentWorkTypeIndex].totalDeals}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={calculateProgressValue(
                          workTypeSales[currentWorkTypeIndex].fullyPaidDeals,
                          workTypeSales[currentWorkTypeIndex].totalDeals
                        )}
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Pending Deals
                      </span>
                      <span className="font-medium">
                        {workTypeSales[currentWorkTypeIndex].pendingDeals} /{" "}
                        {workTypeSales[currentWorkTypeIndex].totalDeals}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={calculateProgressValue(
                          workTypeSales[currentWorkTypeIndex].pendingDeals,
                          workTypeSales[currentWorkTypeIndex].totalDeals
                        )}
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {workTypeSales.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className="h-8 w-8 bg-white shadow-sm hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="h-8 w-8 bg-white shadow-sm hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No work type sales data available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalSales;
