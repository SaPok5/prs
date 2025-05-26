import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";
import DealPage from "@/components/deals/DealPage";
import DashboardContent from "@/components/dashboard/DashboardContent";
import ClientPage from "@/components/client/ClientPage";
// import ViewPage from "@/components/view/ViewPage";
import UserLogin from "@/components/userAuth/UserLogin";
import UserPage from "@/pages/admin/Userpage";
import PaymentPage from "@/components/payment/payment";
import Dashboard2 from "@/components/dashboard2/Dashbord2";
import ProfilePage from "@/components/profile/ProfilePage";
import OrgnizationLogin from "@/components/userAuth/OrgnizationLogin";
import VerifyPayment from "@/components/payment/verifyPayment";
import ClientDetails from "@/components/client_view/Client_Detail";
import TeamPage from "@/components/team/TeamPage";
import RolePage from "@/components/role/RolePage";
import OrgProfile from "@/components/organization_profile/OrgProfile";
import RegisterOrganization from "@/components/userAuth/RegisterOrganization";
import WorkType from "@/components/Worktype/WorkTypePage";
import SourceType from "@/components/SourceType/SourceTypePage";
import Commission from "@/components/commission/Comission";
import Offer from "@/pages/admin/Offer";
// import Logout from "@/pages/Logout";
import VerifierDashboard from "@/components/verifierDashboard/VerifierDashboard";
import { ProtectedRoute } from "@/layout/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLogin />,
  },
  {
    path: "/organizationLogin",
    element: <OrgnizationLogin />,
  },
  {
    path: "/register-org",
    element: <RegisterOrganization />,
  },
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "dashboard2",
            element: <Dashboard2 />,
          },
          {
            path: "team",
            element: <TeamPage />,
          },
          {
            path: "/role",
            element: <RolePage />,
          },
          {
            path: "/orgProfile",
            element: <OrgProfile />,
          },
          {
            path: "/worktype",
            element: <WorkType />,
          },
          {
            path: "/sourceType",
            element: <SourceType />,
          },
          {
            path: "/commission",
            element: <Commission />,
          },
          {
            path: "/offer",
            element: <Offer />,
          },
         
          {
            path: "/users",
            element: <UserPage />,
          },
         
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin","verifier"]} />,
        children:[
          {
            path: "/payment",
            element: <PaymentPage />,
          },
        ]
      },

      {
        element: <ProtectedRoute allowedRoles={["admin","verifier"]} />,
        children:[
          {
            path: "verifier-dashboard",
            element: <VerifierDashboard />,
          },
          {
            path: "/verifyPayment",
            element: <VerifyPayment />,
          },
        ]
      },
      {
        path: "deals",
        element: <DealPage />,
      },
     
      {
        path: "dashboard",
        element: <DashboardContent />,
      },
     
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      // {
      //   path: "/deal-view/:id",
      //   element: <ViewPage />,
      // },
     
      {
        path: "/clientDetails/:id",
        element: <ClientDetails />,
      },
      {
        path: "/clients",
        element: <ClientPage />,
      },

    ],
  },
]);
