import TodaySale from "./TodaySale";
import BarChart from "./BarChart";
import TotalSales from "./TotalSales";
import PaymentActivities from "./PaymentActivities";
import SourceTypeDashbaord from "./SourceTypeDashboard";
import { GET_ALL_TEAMS } from "@/graphql/query/teams.query";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { selectAuthRole } from "@/redux/auth/authSlice";

function DashboardContent() {
  const role = useSelector(selectAuthRole)
  

  const { data: allTeamsQuery } = useQuery(GET_ALL_TEAMS, {
    skip: role !== "admin",
  });

  return (
    <div className="flex-1 p-6 bg-gray-100 w-[85vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaySale allTeams={role === "admin" ? allTeamsQuery?.allTeams : []} />
        <TotalSales
          allTeams={role === "admin" ? allTeamsQuery?.allTeams : []}
        />
      </div>

      {/* Total Member Sales */}
      {role == "admin" ? (
        <div className="grid grid-cols-1 gap-6 mt-6 ">
          <BarChart />
        </div>
      ) : null}

      {/* Source Type & Payment Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 shadow rounded-[15px]">
          
          <div className="">
            <SourceTypeDashbaord
              allTeams={role === "admin" ? allTeamsQuery?.allTeams : []}
              role = {role}
            />
          </div>
        </div>

        <PaymentActivities />
      </div>
    </div>
  );
}

export default DashboardContent;
