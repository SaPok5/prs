import React, { useEffect, useState } from "react";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram, FaGithub, FaTiktok, FaGlobe, FaAd, FaUserAlt } from 'react-icons/fa';
import { useQuery } from "@apollo/client";
import { SOURCE_TYPE_SALES_COMPARISION } from "@/graphql/query/source-type.query";
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export interface SourceTypeMonthComparison {
  currentDeals: string;
  currentTotal: string;
  lastDeals: string;
  lastTotal: string;
  salesComparison: string;
  sourceTypeName: string;
}

const sourceTypeColors = {
  facebook: { color: 'bg-blue-600', icon: <FaFacebook className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  youtube: { color: 'bg-red-600', icon: <FaYoutube className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  google: { color: 'bg-blue-500', icon: <FaGlobe className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  twitter: { color: 'bg-blue-400', icon: <FaTwitter className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  instagram: { color: 'bg-pink-500', icon: <FaInstagram className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  github: { color: 'bg-gray-800', icon: <FaGithub className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  tiktok: { color: 'bg-black', icon: <FaTiktok className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  advertisement: { color: 'bg-yellow-400', icon: <FaAd className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  website: { color: 'bg-gray-900', icon: <FaGlobe className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
  others: { color: 'bg-gray-500', icon: <FaUserAlt className="text-white h-4 w-4 sm:h-6 sm:w-6" /> },
};

export interface GetSourceTypeComparisonSales {
  sourceTypeSalesComparision: SourceTypeMonthComparison[];
}

interface SpeedometerDashboardProps {
  allTeams: [{
    teamName: string;
    id: string
  }],
  role: string | null
}

const SourceTypeDashboard: React.FC<SpeedometerDashboardProps> = ({
  allTeams,
  role
}) => {
  const [selectedData, setSelectedData] = useState("this week");
  const [selectedComparisionData, setSelectedComparisionData] = useState("last week");
  const [selectedTeamId, setSelectedTeamId] = useState<any>(null);

  const { loading, error, data, refetch } = useQuery<GetSourceTypeComparisonSales>(
    SOURCE_TYPE_SALES_COMPARISION,
    {
      variables: {
        input: {
          data: selectedData,
          comparisionData: selectedComparisionData,
          teamId: selectedTeamId
        },
      },
      fetchPolicy:"network-only"
    }
  );

  useEffect(() => {
    refetch({
      input: {
        data: selectedData,
        comparisionData: selectedComparisionData,
      },
    });
  }, [selectedData, selectedComparisionData, refetch]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  if (error) {
    console.error("GraphQL Error:", error);
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  if (!data?.sourceTypeSalesComparision) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-600">No data available.</p>
      </div>
    );
  }

  const formatPercentage = (value: string): string => {
    const numValue = parseFloat(value);
    return `${Math.abs(numValue).toFixed(1)}%`;
  };

  const isPositive = (value: string): boolean => parseFloat(value) >= 0;

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Source Type</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          {role === "admin" && (
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="border px-2 py-1 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base w-full"
            >
              <option value="" disabled>Select a team</option>
              {allTeams?.map((team) => (
                <option key={team.id} value={team.id}>{team.teamName}</option>
              ))}
            </select>
          )}
          <select
            value={selectedData}
            onChange={(e) => setSelectedData(e.target.value)}
            className="border px-2 py-1 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base w-full"
          >
            <option value="this week">This Week</option>
            <option value="last week">Last Week</option>
            <option value="this month">This Month</option>
            <option value="last month">Last Month</option>
            <option value="this year">This Year</option>
            <option value="last year">Last Year</option>
          </select>
          <select
            value={selectedComparisionData}
            onChange={(e) => setSelectedComparisionData(e.target.value)}
            className="border px-2 py-1 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base w-full"
          >
            <option value="this week">This Week</option>
            <option value="last week">Last Week</option>
            <option value="this month">This Month</option>
            <option value="last month">Last Month</option>
            <option value="this year">This Year</option>
            <option value="last year">Last Year</option>
          </select>
        </div>
      </div>

      <hr className="my-2 sm:my-4 border-gray-300" />

      <div className="grid gap-4 sm:gap-6">
        {data.sourceTypeSalesComparision.map((source, index) => {
          const sourceKey = source.sourceTypeName.toLowerCase() as keyof typeof sourceTypeColors;
          const { color, icon } = sourceTypeColors[sourceKey] || sourceTypeColors.others;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-100"
            >
              <div className={`flex items-center ${color} text-white p-2 sm:p-4 rounded-md`}>
                {icon}
                <h3 className="text-base sm:text-xl font-semibold ml-2 sm:ml-3">{source.sourceTypeName}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mt-3 sm:mt-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="font-medium text-gray-700 text-sm sm:text-base mb-2 sm:mb-3">Current Period</p>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-sm sm:text-lg">
                      Total Deal: <span className="font-semibold">{source.currentDeals}</span>
                    </p>
                    <p className="text-sm sm:text-lg">
                      Total Value: <span className="font-semibold">{source.currentTotal}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="font-medium text-gray-700 text-sm sm:text-base mb-2 sm:mb-3">Previous Period</p>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-sm sm:text-lg">
                      Total Deal: <span className="font-semibold">{source.lastDeals}</span>
                    </p>
                    <p className="text-sm sm:text-lg">
                      Total Value: <span className="font-semibold">{source.lastTotal}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-6 flex items-center">
                <div className={`flex items-center ${isPositive(source.salesComparison) ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive(source.salesComparison) ? (
                    <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  )}
                  <span className="text-sm sm:text-base font-semibold">
                    {formatPercentage(source.salesComparison)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourceTypeDashboard;