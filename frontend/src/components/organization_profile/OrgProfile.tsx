import { OrgInfo } from "./OrgInfo";
import { GET_ORGANIZATION_BY_ID, GET_ALL_USERS, DISPLAY_ROLES, GET_ALL_TEAMS, CLIENTS, GET_USERS_DEALS } from "@/graphql/queries";
import { GET_SOURCE_TYPE } from '../../graphql/query/source-type.query';
import { GET_WORKTYPES } from '../../graphql/query/work-type.query';
import { useQuery } from "@apollo/client";
import OrgChangePassword from "./orgChangePassword";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/redux/auth/authSlice";
import { Users, Briefcase, DollarSign, Shield, Layers, Globe, UserPlus, Users as TeamIcon } from "lucide-react";
import OrgMetricsChart from "./OrgMetricsChart";

// interface Deal {
//   dealValue: number;
//   receivedAmount: number;
// }

function OrgProfile() {
  const orgId = useSelector(selectOrganizationId);
  const { loading, error, data } = useQuery(GET_ORGANIZATION_BY_ID, {
    variables: { orgId },
  });
  const { loading: usersLoading, data: usersData } = useQuery(GET_ALL_USERS, { variables: { orgId } });
  const { loading: workTypesLoading, data: workTypesData } = useQuery(GET_WORKTYPES, { variables: { orgId } });
  const { loading: sourceTypesLoading, data: sourceTypesData } = useQuery(GET_SOURCE_TYPE, { variables: { orgId } });
  const { loading: rolesLoading, data: rolesData } = useQuery(DISPLAY_ROLES, { variables: { orgId } });
  const { loading: teamsLoading, data: teamsData } = useQuery(GET_ALL_TEAMS, { variables: { orgId } });
  const { loading: clientsLoading, data: clientsData } = useQuery(CLIENTS, { variables: { orgId } });
  const { loading: dealsLoading, data: dealsData } = useQuery(GET_USERS_DEALS, { variables: { orgId } });

  const isLoading =
    loading ||
    usersLoading ||
    workTypesLoading ||
    sourceTypesLoading ||
    rolesLoading ||
    teamsLoading ||
    clientsLoading ||
    dealsLoading;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching organization: {error.message}</p>;

  const totalUsers = usersData?.gettAllUsers?.length || 0;
  const totalWorkTypes = workTypesData?.workTypes?.data?.length || 0;
  const totalSourceTypes = sourceTypesData?.sourceTypes?.data?.length || 0;
  const totalRoles = rolesData?.displayAllRolesOfOrganization?.roles?.length || 0;
  const totalTeams = teamsData?.allTeams?.length || 0;
  const totalClients = clientsData?.clients?.length || 0;

  const deals = dealsData?.dealsOfUser?.deals.deals || [];
  const totalDeals = deals.length;

  const totalPayments = deals.reduce(
    (sum: number, deal: any) => {
      const dealPayments = deal.payments || [];
      return (
        sum +
        dealPayments.reduce(
          (paymentSum: number, payment: any) => paymentSum + (payment.receivedAmount || 0),
          0
        )
      );
    },
    0
  );

//   const totalDealValue = deals.reduce((sum: number, deal: any) => sum + (deal.dealValue || 0), 0);

  const orgs = data?.getOrgById?.organization;

  return (
    <div className="bg-gray-100 w-[80vw] p-4 rounded shadow rounded-[15px]">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Organization Profile</h1>
      </div>
  
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 mb-10">
        {/* Left-side profile section */}
        <div className="bg-white p-8 rounded-lg shadow w-full md:w-1/2 mb-6 md:mb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Organization Information</h2>
            <OrgInfo />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Organization Name</label>
              <p className="text-lg text-gray-800">{orgs.organizationName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Organization Email</label>
              <p className="text-lg text-gray-800">{orgs.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
              <p className="text-lg text-gray-800">{format(orgs.createdAt, "EEEE, MMMM dd, yyyy")}</p>
            </div>
          </div>
  
          <div className="mt-10">
            <OrgChangePassword />
          </div>
        </div>
  
        {/* Right-side metrics and chart section */}
        <div className="bg-white p-8 rounded-lg shadow w-full md:w-1/2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Organization Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
              <Users size={40} className="text-blue-500" />
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-lg font-semibold text-gray-800">{totalUsers}</p>
              </div>
            </div>
  
            <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
              <Briefcase size={40} className="text-green-500" />
              <div>
                <p className="text-gray-600">Total Deals</p>
                <p className="text-lg font-semibold text-gray-800">{totalDeals}</p>
              </div>
            </div>
  
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center space-x-4">
              <DollarSign size={40} className="text-yellow-500" />
              <div>
                <p className="text-gray-600">Total Payments</p>
                <p className="text-lg font-semibold text-gray-800">{totalPayments}</p>
              </div>
            </div>
  
            <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-4">
              <Shield size={40} className="text-red-500" />
              <div>
                <p className="text-gray-600">Total Roles</p>
                <p className="text-lg font-semibold text-gray-800">{totalRoles}</p>
              </div>
            </div>
  
            <div className="bg-indigo-50 p-4 rounded-lg flex items-center space-x-4">
              <Layers size={40} className="text-indigo-500" />
              <div>
                <p className="text-gray-600">Total Work Types</p>
                <p className="text-lg font-semibold text-gray-800">{totalWorkTypes}</p>
              </div>
            </div>
  
            <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
              <Globe size={40} className="text-purple-500" />
              <div>
                <p className="text-gray-600">Total Source Types</p>
                <p className="text-lg font-semibold text-gray-800">{totalSourceTypes}</p>
              </div>
            </div>
  
            <div className="bg-orange-50 p-4 rounded-lg flex items-center space-x-4">
              <UserPlus size={40} className="text-orange-500" />
              <div>
                <p className="text-gray-600">Total Clients</p>
                <p className="text-lg font-semibold text-gray-800">{totalClients}</p>
              </div>
            </div>
  
            <div className="bg-teal-50 p-4 rounded-lg flex items-center space-x-4">
              <TeamIcon size={40} className="text-teal-500" />
              <div>
                <p className="text-gray-600">Total Teams</p>
                <p className="text-lg font-semibold text-gray-800">{totalTeams}</p>
              </div>
            </div>
          </div>
  
          {/* Organization Metrics Graph Below */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Organization Metrics Graph</h2>
            <OrgMetricsChart
              totalUsers={totalUsers}
              totalDeals={totalDeals}
              totalPayments={totalPayments}
              totalRoles={totalRoles}
              totalWorkTypes={totalWorkTypes}
              totalSourceTypes={totalSourceTypes}
              totalClients={totalClients}
              totalTeams={totalTeams}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
  
  }
  
  export default OrgProfile;
  
