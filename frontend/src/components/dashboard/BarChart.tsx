import  { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LabelList,
} from "recharts";
import { CircleUserRound } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_DEALS_USERS } from "@/graphql/query/sales.query";

const chartConfig: any = {
  chartType: {
    label: "Chart Bar Chart",
    icon: CircleUserRound,
    color: "#6366f1",
    theme: {
      light: "#fff",
      dark: "#333",
    },
  },
  title: "Total Member Sales",
};

function BarChart() {
  const [timeFrame, setTimeFrame] = useState("thisWeek");
  const [activeIndex, setActiveIndex] = useState<any>(null);

  const { loading, error, data, refetch } = useQuery(GET_TOTAL_DEALS_USERS, {
    variables: { timeFrame },
  });

  const handleTimeFrameChange = (newTimeFrame: any) => {
    setTimeFrame(newTimeFrame);
    refetch({ timeFrame: newTimeFrame });
  };

  if (loading) return <p>Loading data...</p>;
  if (error)
    return <p className="text-red-500">Error fetching data: {error.message}</p>;

  const chartData =
    data?.displayTotalDealsOfUsers?.data?.map((user: any) => ({
      name: user.userName,
      totalValue: parseInt(user.totalValue, 10),
      totalDeals: user.totalDeals,
    })) || [];

  const renderXAxisLabel = ({ x, y, value }: any) => (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      fill="#64748b"
      className="text-xs font-medium"
    >
      {value}
    </text>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-100 w-48">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {data.name}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Value:</span>
                <span className="text-xs font-medium text-gray-900">
                  ${data.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Deals:</span>
                <span className="text-xs font-medium text-gray-900">
                  {data.totalDeals}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {chartConfig.title}
          </h2>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => handleTimeFrameChange(e.target.value)}
            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="max-h-[500px] min-h-[100px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tick={renderXAxisLabel}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    position={{ y: 0 }}
                    active={activeIndex !== null}
                  />
                  <Bar
                    dataKey="totalValue"
                    fill={chartConfig.chartType.color}
                    radius={[6, 6, 0, 0]}
                    barSize={25}
                    onMouseOver={(_data, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <LabelList
                      dataKey="name"
                      position="bottom"
                      fill="#4b5563"
                      fontSize={12}
                    />
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <span className="text-gray-500">No data</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BarChart;
