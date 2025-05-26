import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import "react-day-picker/dist/style.css";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GET_EMPLOYEE_SALES_BY_TEAM } from "@/graphql/query/sales.query";
import { GET_ALL_TEAMS } from "@/graphql/query/teams.query";
import { WORKTYPES } from "@/graphql/query/work-type.query";
import SalesFilter from "../dashboard/SalesFilter";

const Dashboard = () => {
  const [teamId, setTeamId] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterData, setFilterData] = useState("thisMonth");
  const [selectedRange, setSelectedRange] = useState<string>("This Month");


  const { data: allTeamsQuery, loading: allTeamLoading } =
    useQuery(GET_ALL_TEAMS);
  const { data: workTypesData, loading: loadingWorkType } = useQuery(WORKTYPES);
  const {
    data: salesData,
    loading: loadingSales,
    refetch,
  } = useQuery(GET_EMPLOYEE_SALES_BY_TEAM, {
    variables: {
      input: {
        teamId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        data: filterData,
      },
    },
    skip: !teamId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (allTeamsQuery?.allTeams?.length > 0 && !teamId) {
      setTeamId(allTeamsQuery.allTeams[0].id);
    }
  }, [allTeamsQuery, teamId]);

  useEffect(() => {
    if (teamId) {
      refetch();
    }
  }, [teamId, startDate, endDate, filterData, refetch]);

  const handleDateRangeChange = (from: Date, to: Date) => {
    setStartDate(from);
    setEndDate(to);
    setFilterData("customRange");
  };

  const handleRangeSelection = (range: string) => {
    const now = new Date();
    const ranges = {
      "This Month": {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        filter: "thisMonth",
      },
      "Last Month": {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
        filter: "lastMonth",
      },
      "Last 30 Days": {
        start: new Date(now.setDate(now.getDate() - 30)),
        end: new Date(),
        filter: "lastThirty",
      },
      Custom: {
        filter: "customRange",
      },
    };

    const selectedRange = ranges[range as keyof typeof ranges];
    if (selectedRange) {
      if ("start" in selectedRange) {
        setStartDate(selectedRange.start);
        setEndDate(selectedRange.end);
      }
      setFilterData(selectedRange.filter);
    }
  };

  const getWorkTypeSalesData = (
    employeeData: any,
    workType: any,
    field: "totalDeals" | "totalSales"
  ) => {
    const workTypeSale = employeeData.workTypeSales.find(
      (ws: any) => ws.name === workType.name
    );
    return workTypeSale ? workTypeSale[field].toLocaleString() : "0";
  };

  if (loadingSales || allTeamLoading || loadingWorkType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const teamSales = salesData?.getEmployeeSalesByTeam?.teamSales[0];

  return (
    <div className="space-y-6 p-4 md:p-6 w-full mx-auto max-w-screen-2xl min-h-screen">
      {/* Team Selector and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <Select value={teamId} onValueChange={setTeamId}>
          <div className="w-full sm:w-[300px]">
            <SelectTrigger>
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {allTeamsQuery?.allTeams?.map((team: any) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.teamName}
                </SelectItem>
              ))}
            </SelectContent>
          </div>
        </Select>
        <SalesFilter
          onRangeSelect={handleRangeSelection}
          onDateRangeChange={handleDateRangeChange}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="h-28 flex-shrink-0 overflow-hidden">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500 truncate">
              Total Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-words">
              {teamSales?.totalDeals?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="h-28 flex-shrink-0 overflow-hidden">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500 truncate">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600 break-words">
              ${teamSales?.totalSales?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="h-28 flex-shrink-0 overflow-hidden">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500 truncate">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600 break-words">
              ${teamSales?.totalPaid?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="h-28 flex-shrink-0 overflow-hidden">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500 truncate">
              Total Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600 break-words">
              ${teamSales?.totalDues?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Sales Performance Table */}
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Employee Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead
                    className="font-semibold"
                    style={{
                      minWidth: "200px",
                      padding: "10px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Employee Name
                  </TableHead>
                  {workTypesData?.workTypes?.data.map((workType: any) => (
                    <TableHead
                      key={`${workType.id}-deals`}
                      className="text-right"
                      style={{
                        minWidth: "150px",
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {workType.name} Deals
                    </TableHead>
                  ))}
                  {workTypesData?.workTypes?.data.map((workType: any) => (
                    <TableHead
                      key={`${workType.id}-sales`}
                      className="text-right"
                      style={{
                        minWidth: "150px",
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {workType.name} Sales
                    </TableHead>
                  ))}
                  <TableHead
                    className="text-right"
                    style={{
                      minWidth: "150px",
                      padding: "10px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Total Deals
                  </TableHead>
                  <TableHead
                    className="text-right"
                    style={{
                      minWidth: "150px",
                      padding: "10px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Total Paid
                  </TableHead>
                  <TableHead
                    className="text-right"
                    style={{
                      minWidth: "150px",
                      padding: "10px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Total Sales
                  </TableHead>
                  <TableHead
                    className="text-right"
                    style={{
                      minWidth: "150px",
                      padding: "10px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Total Dues
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamSales?.employees?.map((employee: any) => (
                  <TableRow key={employee.id} className="hover:bg-gray-50">
                    <TableCell
                      className="font-medium"
                      style={{
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {employee.employeeName}
                    </TableCell>
                    {workTypesData?.workTypes?.data.map((workType: any) => (
                      <TableCell
                        key={`${employee.id}-${workType.id}-deals`}
                        className="text-right"
                        style={{
                          minWidth: "150px",
                          padding: "10px",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {getWorkTypeSalesData(employee, workType, "totalDeals")}
                      </TableCell>
                    ))}
                    {workTypesData?.workTypes?.data.map((workType: any) => (
                      <TableCell
                        key={`${employee.id}-${workType.id}-sales`}
                        className="text-right"
                        style={{
                          minWidth: "150px",
                          padding: "10px",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          maxWidth: "4cm",
                        }}
                      >
                        $
                        {getWorkTypeSalesData(employee, workType, "totalSales")}
                      </TableCell>
                    ))}
                    <TableCell
                      className="text-right"
                      style={{
                        minWidth: "150px",
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {employee.totalDeals?.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="text-right"
                     style={{
                          minWidth: "150px",
                          padding: "10px",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          maxWidth: "4cm",
                        }}
                    >
                      ${employee.totalPaid?.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      style={{
                        minWidth: "150px",
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        maxWidth: "4cm",
                      }}
                    >
                      ${employee.totalSales?.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      style={{
                        minWidth: "150px",
                        padding: "10px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        maxWidth: "4cm",
                      }}
                    >
                      ${employee.totalDues?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
