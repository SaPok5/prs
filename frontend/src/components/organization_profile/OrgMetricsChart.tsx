import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OrgMetricsChartProps {
  totalUsers: number;
  totalDeals: number;
  totalPayments: number;
  totalRoles: number;
  totalWorkTypes: number;
  totalSourceTypes: number;
  totalClients: number;
  totalTeams: number;
}

const OrgMetricsChart: React.FC<OrgMetricsChartProps> = ({
  totalUsers,
  totalDeals,
  totalPayments,
  totalRoles,
  totalWorkTypes,
  totalSourceTypes,
  totalClients,
  totalTeams,
}) => {
  const chartData = {
    labels: ['Users', 'Deals', 'Payments', 'Roles', 'Work Types', 'Source Types', 'Clients', 'Teams'],
    datasets: [
      {
        label: 'Metrics',
        data: [
          totalUsers,
          totalDeals,
          totalPayments,
          totalRoles,
          totalWorkTypes,
          totalSourceTypes,
          totalClients,
          totalTeams,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Organization Metrics',
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default OrgMetricsChart;
