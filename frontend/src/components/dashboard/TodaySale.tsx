import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@apollo/client";
import { GET_TODAY_SALES } from "../../graphql/queries";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateProgressValue } from "@/lib/calculateProgressValue";
import { selectAuthRole } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";

interface SalesSummary {
  totalSalesDealValue: number;
  totalPaid: number;
  totalDue: number;
  totalDeals: number;
  pendingDeals: number;
  fullyPaidDeals: number;
  collectionPercentage: number;
  selectedDatePaidAmount:number;
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
  displayTotalSalesOfMonth: {
    summary: SalesSummary;
    workTypeSales?: WorkTypeSales[];
  };
}

const TodaySale = ({ allTeams }: any) => {
  const role = useSelector(selectAuthRole)

  const [date, setDate] = useState<Date>(new Date());
  const [currentWorkTypeIndex, setCurrentWorkTypeIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState<any>(null);

  const {
    loading,
    error,
    data: queryData,
  } = useQuery<SalesData>(GET_TODAY_SALES, {
    variables: {
      input: {
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
        data: "customRange",
        teamId: role === "admin" ? selectedTeamId : null,
      },
    },
    fetchPolicy:"network-only"
  });

  if (loading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading sales data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-4 bg-red-50">
        <CardContent className="text-red-600">
          Error loading sales data: {error.message}
        </CardContent>
      </Card>
    );
  }

  const summary = queryData?.displayTotalSalesOfMonth.summary;
  const workTypeSales =
    queryData?.displayTotalSalesOfMonth?.workTypeSales ?? [];

  const handleNext = () => {
    setCurrentWorkTypeIndex((prev) => (prev + 1) % workTypeSales.length);
  };

  const handlePrev = () => {
    setCurrentWorkTypeIndex(
      (prev) => (prev - 1 + workTypeSales.length) % workTypeSales.length
    );
  };

  const currentWorkType = workTypeSales[currentWorkTypeIndex];
  

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Today's Total Sale</CardTitle>
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap w-full md:w-auto">
          {role === "admin" && (
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="border px-3 py-2 rounded-md w-full sm:w-auto"
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
  
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[200px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
       
        <div className="text-2xl font-bold text-primary">
          Total Sales: ${summary?.selectedDatePaidAmount}
        </div>
        <div className="text-2xl font-bold text-primary">
          Total Deals: {summary?.totalDeals ?? 0}
          {/* {summary?.totalDeals?.toLocaleString() ?? 0} */}
        </div>
        <hr className="border-gray-300" />

        <div className="space-y-4">
          {[
            {
              label: "Total Paid",
              value: summary?.totalPaid,
              format: "currency",
              outOf: summary?.totalSalesDealValue,
            },
            {
              label: "Total Due",
              value: summary?.totalDue,
              format: "currency",
              outOf: summary?.totalSalesDealValue,
            },

            {
              label: "Pending Deals",
              value: summary?.pendingDeals,
              format: "number",
              outOf: summary?.totalDeals,
            },
            {
              label: "Fully Paid Deals",
              value: summary?.fullyPaidDeals,
              format: "number",
              outOf: summary?.totalDeals,
            },
            {
              label: "Collection %",
              value: summary?.collectionPercentage,
              format: "percentage",
            },
          ].map(({ label, value, format, outOf }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-medium">
                  {format === "currency"
                    ? `$${value?.toLocaleString() ?? 0}${
                        outOf ? ` / $${outOf?.toLocaleString()}` : ""
                      }`
                    : format === "percentage"
                    ? `${value?.toFixed(2)}%`
                    : `${value?.toLocaleString() ?? 0}${
                        outOf ? ` / ${outOf?.toLocaleString()}` : ""
                      }`}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={
                    format === "percentage"
                      ? value
                      : calculateProgressValue(
                          value ?? 0,
                          format === "currency"
                            ? summary?.totalSalesDealValue ?? 0
                            : summary?.totalDeals ?? 0
                        )
                  }
                  className={`h-2 bg-gray-200 [&>div]:bg-blue-500`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Work Type Sales</h3>
          {workTypeSales.length > 0 ? (
            <div className="relative">
              <Card className="bg-gray-50">
                <CardContent className="space-y-4 pt-6">
                  <h4 className="font-medium text-lg">
                    {currentWorkType.name}
                  </h4>{" "}
                  
                  <p className="text-lg font-bold text-primary">
                      Total Deal Value: $
                      {currentWorkType.totalSalesDealValue}
                    </p>

                  {/* Payment Percentage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Payment Percentage
                      </span>
                      <span className="font-medium">
                        {Number(currentWorkType.paymentPercentage)
                          .toFixed(2)
                          .toLocaleString()}
                        %
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={currentWorkType.paymentPercentage}
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>
                  {/* Fully Paid Deals */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Fully Paid Deals
                      </span>
                      <span className="font-medium">
                        {currentWorkType.fullyPaidDeals} /{" "}
                        {currentWorkType.totalDeals}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={calculateProgressValue(
                          currentWorkType.fullyPaidDeals,
                          currentWorkType.totalDeals
                        )}
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>
                  {/* Pending Deals */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Pending Deals
                      </span>
                      <span className="font-medium">
                        {currentWorkType.pendingDeals} /
                        {currentWorkType.totalDeals}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={calculateProgressValue(
                          currentWorkType.pendingDeals,
                          currentWorkType.totalDeals
                        )}
                        className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation buttons */}
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
              No work type sales data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySale;
