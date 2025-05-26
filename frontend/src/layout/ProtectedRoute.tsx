import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthRole, selectCurrentToken } from "@/redux/auth/authSlice";


export const ProtectedRoute = ({ allowedRoles }:{allowedRoles:string[]}) => {
  const currentUserToken = useSelector(selectCurrentToken);
  const userRole = useSelector(selectAuthRole);

  if (!currentUserToken) {
    return <Navigate to="/" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    if (userRole === 'verifier') {
      return <Navigate to="/verifier-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};