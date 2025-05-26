import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  Handshake,
  LayoutDashboard,
  LogOut,
  Settings,
  User2,
  UserPen,
  UserRound,
  UsersRound,
} from "lucide-react";
import techPaymentLogo from "@/assets/tech payment 1.png";
import profile from "@/assets/girl.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { selectAuthRole } from "@/redux/auth/authSlice";

function Sidebar() {
  const currentRole = useSelector(selectAuthRole)
  return (
    <div>
      <div
        className={cn(
          "w-64 h-screen bg-gray-800 text-white flex flex-col justify-between fixed left-0 top-0"
        )}
      >
        <div>
          {/* Logo */}
          <div className="p-4 flex justify-center">
            <img
              src={techPaymentLogo}
              alt="Tech Payments Logo"
              className="h-[80px] w-[160px]"
            />
          </div>
          <Separator className="bg-gray-700" />

          {/* Main Menu */}
          <ul className="mt-4 space-y-1">
            {currentRole === "admin" ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                    )}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard2"
                    className={cn(
                      "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                    )}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    <span>Dashboard2</span>
                  </Link>
                </li>
              </>
            ) : null}

            {currentRole === "verifyer" ? (
              <li>
                <Link
                  to="/deals"
                  className={cn(
                    "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                  )}
                >
                  <Handshake className="mr-2 h-5 w-5" />
                  <span>Deals</span>
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                to="/clients"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <UsersRound className="mr-2 h-5 w-5" />
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link
                to="/team"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <User2 className="mr-2 h-5 w-5" />
                <span>Team</span>
              </Link>
            </li>
            <li>
              <Link
                to="/payment"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <CircleDollarSign className="mr-2 h-5 w-5" />
                <span>Payments</span>
              </Link>
            </li>
            <li>
              <Link
                to="/verifyPayment"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <CircleDollarSign className="mr-2 h-5 w-5" />
                <span>Verify Payments</span>
              </Link>
            </li>
          </ul>

          {/* "Other" Section */}
          <p className="text-gray-400 p-4 mt-10 uppercase text-xs">Other</p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/support"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <ChartNoAxesCombined className="mr-2 h-5 w-5" />
                <span>Support</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <UserRound className="mr-2 h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/role"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <UserPen  className="mr-2 h-5 w-5" />
                <span>Role</span>
              </Link>
            </li>
            <li>
              <Link
                to="/orgProfile"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <UserPen  className="mr-2 h-5 w-5" />
                <span>Organization Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center p-4 hover:bg-blue-700 rounded-md transition"
                )}
              >
                <Settings className="mr-2 h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>

          {/* Profile and Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={profile}
                  alt="Profile"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="text-sm font-semibold">Madhav Acharya</p>
                  <p className="text-xs text-gray-400">email@example.com</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-gray-400 text-white"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
