import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_VERIFIER_DASHBOARD } from "@/graphql/query/payment.query";

interface Payment {
  id: string;
  paymentDate: string;
  receivedAmount: number;
  receiptImage: string;
  remarks: string;
  denialRemarks: string | null;
  paymentStatus: string;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

interface DashboardData {
  periodLabel: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  pending: { count: number; total: number };
  verified: { count: number; total: number };
  denied: { count: number; total: number };
  payments: {
    verified: Payment[];
    denied: Payment[];
    pending: Payment[];
  };
}

type DateRangeType = "lastMonth" | "lastThirty" | "customRange" | "thisMonth";

const StatCard = ({
  title,
  value,
  total,
  icon,
  colorClass,
}: {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p
            className="text-sm text-gray-500 mt-1"
            style={{
              maxWidth: "5cm",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            ${total.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-full p-3 ${colorClass}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const VerifierDashboard = () => {
  const [timeFilter, setTimeFilter] = useState<DateRangeType>("thisMonth");

  const { data, loading, error } = useQuery<{
    displayVerificationDashboard: DashboardData;
  }>(GET_VERIFIER_DASHBOARD, {
    variables: {
      input: {
        data: timeFilter,
      },
    },
    fetchPolicy: "network-only",
  });

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const dashboard = data?.displayVerificationDashboard;

  // Prepare chart data
  const chartData = dashboard?.payments
    ? [
        {
          name: dashboard.periodLabel,
          Pending: dashboard.pending.count,
          Verified: dashboard.verified.count,
          Denied: dashboard.denied.count,
        },
      ]
    : [];

  // const getAllDaysInMonth = (month: number, year: number): string[] => {
  //   const days: string[] = [];
  //   for (let day = 1; day <= 31; day++) {
  //     const date = new Date(year, month, day);
  //     if (date.getMonth() === month) {
  //       days.push(date.toISOString().split('T')[0]);
  //     }
  //   }
  //   return days;
  // };

  const paymentsOverTime = () => {
    if (!dashboard?.payments) return [];

    const dateMap = new Map();

    // Set date range to full year if not provided
    const startDate = dashboard.dateRange?.startDate
      ? new Date(dashboard.dateRange.startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = dashboard.dateRange?.endDate
      ? new Date(dashboard.dateRange.endDate)
      : new Date(new Date().getFullYear(), 11, 31);

    // Initialize all dates in the range with zero values
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      dateMap.set(dateKey, {
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        verifiedAmount: 0,
        deniedAmount: 0,
        pendingAmount: 0,
      });
      // Increment the date
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add verified payments data
    dashboard.payments.verified.forEach((payment) => {
      const dateKey = new Date(payment.paymentDate).toISOString().split("T")[0];
      if (dateMap.has(dateKey)) {
        const entry = dateMap.get(dateKey);
        entry.verifiedAmount += payment.receivedAmount;
      }
    });

    // Add denied payments data
    dashboard.payments.denied.forEach((payment) => {
      const dateKey = new Date(payment.paymentDate).toISOString().split("T")[0];
      if (dateMap.has(dateKey)) {
        const entry = dateMap.get(dateKey);
        entry.deniedAmount += payment.receivedAmount;
      }
    });

    // Add pending payments data
    dashboard.payments.pending.forEach((payment) => {
      const dateKey = new Date(payment.paymentDate).toISOString().split("T")[0];
      if (dateMap.has(dateKey)) {
        const entry = dateMap.get(dateKey);
        entry.pendingAmount += payment.receivedAmount;
      }
    });
    return Array.from(dateMap.values());
  };

  return (
    <div className="p-6 space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deal Verification Dashboard</h1>
        <Select
          value={timeFilter}
          onValueChange={(value: DateRangeType) => setTimeFilter(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="lastThirty">Last 30 Days</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6 w-full justify-between xl:ml-16">
        {/* Stat Cards Section */}
        <div className="flex-1 min-w-[480px] xl:min-w-[700px] mt-6 xl:mt-12">
          <div className="grid lg:grid-cols-3 gap-6">
            <StatCard
              title="Pending Deals"
              value={dashboard?.pending.count || 0}
              total={dashboard?.pending.total || 0}
              icon={<Clock className="h-6 w-6 text-[#eab308]" />}
              colorClass="bg-yellow-200"
            />
            <StatCard
              title="Verified Deals"
              value={dashboard?.verified.count || 0}
              total={dashboard?.verified.total || 0}
              icon={<CheckCircle className="h-6 w-6 text-green-600" />}
              colorClass="bg-green-100"
            />
            <StatCard
              title="Rejected Deals"
              value={dashboard?.denied.count || 0}
              total={dashboard?.denied.total || 0}
              icon={<AlertCircle className="h-6 w-6 text-red-600" />}
              colorClass="bg-red-100"
            />
          </div>
        </div>

        {/* Bar Chart for Deals Status */}
        <div className="flex-1 min-w-[300px] lg:min-w-[380px] xl:min-w-[480px] lg:ml-12 xl:ml-16 mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Deal Status Distribution
              </h3>
              <ResponsiveContainer width="95%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Pending" fill="#eab308" />
                  <Bar dataKey="Verified" fill="#22c55e" />
                  <Bar dataKey="Denied" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payments Over Time Line Chart (Full Width) */}
      <div className="mt-6 w-full max-w-[98%] mx-auto">
        <Card className="shadow-lg">
          <CardContent className="pt-6 px-8">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Payment Trends Over Time
              </h3>

              <div className="flex justify-center gap-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">Verified</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <span className="text-sm">Denied</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                  <span className="text-sm">Pending</span>
                </div>
              </div>

              {/* Responsive Container with dynamic width */}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={paymentsOverTime()}
                  margin={{ top: 20, right: 40, bottom: 40, left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    width={60}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      return `$${(value / 100).toLocaleString()}`;
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      padding: "12px",
                    }}
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
                      name,
                    ]}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="verifiedAmount"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                    name="Verified"
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="deniedAmount"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#dc2626", strokeWidth: 2 }}
                    name="Denied"
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pendingAmount"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#eab308", strokeWidth: 2 }}
                    name="Pending"
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifierDashboard;
