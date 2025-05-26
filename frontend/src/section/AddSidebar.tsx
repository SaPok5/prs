import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import prslogo from "@/assets/prslogo.png";

import {
  LayoutDashboard,
  Handshake,
  Calendar,
  CircleDollarSign,
  UserRound,
  BookCheck,
  Users,
  UsersRound,
  DollarSign,
  Building,
  Briefcase,
  UserPen,
  HandCoins,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useApolloClient } from "@apollo/client";
import { loggedOut, selectAuthRole } from "@/redux/auth/authSlice";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Verifier Dashboard",
    url: "/verifier-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Dashboard2",
    url: "/dashboard2",
    icon: UserRound,
  },
  {
    title: "Deals",
    url: "/deals",
    icon: Handshake,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Calendar,
  },
  {
    title: "Payment",
    url: "/payment",
    icon: CircleDollarSign,
  },
  {
    title: "Verify Payment",
    url: "/verifyPayment",
    icon: BookCheck,
  },

  {
    title: "Profile",
    url: "/profile",
    icon: UserRound,
  },
  {
    title: "Team",
    url: "/team",
    icon: UsersRound,
  },
  {
    title: "Commission",
    url: "/commission",
    icon: DollarSign,
  },
  {
    title: "Offer",
    url: "/offer",
    icon: HandCoins,
  },
  {
    title: "Role",
    url: "/role",
    icon: UserRound,
  },
  {
    title: "Work Type",
    url: "/workType",
    icon: Briefcase,
  },
  {
    title: "Source Type",
    url: "/sourceType",
    icon: UserPen,
  },
  {
    title: "Organization Profile",
    url: "/orgProfile",
    icon: Building,
  },
  // {
  //   title: "Logout",
  //   url: "/logout",
  //   icon: LogOut,
  // },
];

export function AppSidebar() {
  const role = useSelector(selectAuthRole);
  const client = useApolloClient();
  const dispatch = useDispatch();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await client.cache.reset();
      dispatch(loggedOut());
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const filteredItems =
    role === "admin"
      ? items.filter(
          (item) => item.title !== "Profile" &&  item.title !== "Verifier Dashboard" && item.title !== "Verify Payment"
        )
      : role === "verifier"
      ? items.filter(
          (item) =>
            item.title !== "Users" &&
            item.title !== "Settings" &&
            item.title !== "Deals" &&
            item.title !== "Dashboard2" &&
            item.title !== "Team" &&
            item.title !== "Clients" &&
            item.title !== "Role" &&
            item.title !== "Organization Profile" &&
            item.title !== "Dashboard2" &&
            item.title !== "Work Type" &&
            item.title !== "Source Type" &&
            item.title !== "Commission" &&
            item.title !== "Dashboard" &&
            
            item.title !== "Offer"
        )
      : items.filter(
          (item) =>
            item.title !== "Users" &&
            item.title !== "Settings" &&
            item.title !== "Verify Payment" &&
            item.title !== "Payment" &&
            item.title !== "Team" &&
            item.title !== "Role" &&
            item.title !== "Organization Profile" &&
            item.title !== "Dashboard2" &&
            item.title !== "Work Type" &&
            item.title !== "Source Type" &&
            item.title !== "Commission" &&
            item.title !== "Verifier Dashboard" &&

            item.title !== "Offer"
        );

  return (
    <>
      <Sidebar className="w-60 bg-gradient-to-b border-gray-600 bg-gray-800 from-gray-900 via-gray-800 to-gray-700 text-gray-200 shadow-lg">
        {/* Sidebar Header */}
        <SidebarHeader className="p-4 border-b bg-gray-800 border-gray-600">
          <div className="flex justify-center items-center">
            <div className="p-3 bg-white rounded-2xl backdrop-blur-sm shadow-lg">
              <img
                src={prslogo}
                alt="Tech Payments Logo"
                className="h-[100px] w-[180px] object-contain rounded-xl transition-transform hover:scale-110"
              />
            </div>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="p-4 border-t border-gray-600 bg-gray-800">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-4 py-2">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="group flex items-center px-4 py-3 text-gray-300 rounded-lg transition-all duration-200 
                          hover:bg-gray-700/50 hover:text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ))}
                <div
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="group cursor-pointer flex items-center px-4 py-3 text-gray-300 rounded-lg transition-all duration-200 
                          hover:bg-gray-700/50 hover:text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <LogOut className="w-5 h-5 mr-3  text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium">Logout</span>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-4 border-t border-gray-600 bg-gray-800">
          <div className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Payment Record System
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of the Payment Record System and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}