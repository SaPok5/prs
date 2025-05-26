import { Navigate, Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/section/AddSidebar"
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/auth/authSlice";

const AppLayout = () => {
  const currentUserToken = useSelector(selectCurrentToken);
  if (!currentUserToken) {
    return <Navigate to="/" replace />;

}
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet/>

      </main>
    </SidebarProvider>
    
    
  )
}


export default AppLayout
