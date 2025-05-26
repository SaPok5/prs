import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ORGANIZATION_LOGIN } from "@/graphql/mutations";
import prslogo from "@/assets/prslogo.png";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthRole, selectCurrentToken, setCredentials } from "@/redux/auth/authSlice";
import { Eye, EyeClosed } from "lucide-react"; 
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


const OrganizationLogin = () => {
  const dispatch = useDispatch();
  const currentUserToken = useSelector(selectCurrentToken);
  const role = useSelector(selectAuthRole)
  if (currentUserToken) {
    if(role == "verifier"){
      return <Navigate to="/verifier-dashboard" />
    }
    return <Navigate to="/dashboard" />;
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading }] = useMutation(ORGANIZATION_LOGIN);
  const navigate = useNavigate();

  // State for managing dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      setDialogType('error');
      setDialogMessage("Please fill in both email and password.");
      setDialogOpen(true);
      return;
    }
  
    try {
      const response = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
  
      const loginData = response.data.organizationLogin;
  
      if (loginData.success) {
        // Save credentials to Redux store
        dispatch(setCredentials({
          token: loginData.token,
          email: loginData.organization.email,
          organizationId: loginData.organization.id,
          role: loginData.role,
          organizationName: loginData.organizationName
        }));
  
        
        navigate("/dashboard");
      } else {
        // Show error dialog
        setDialogType('error');
        setDialogMessage(loginData.message || "Login failed");
        setDialogOpen(true);
      }
    } catch (err) {
      console.error(err);
  
     
      setDialogType('error');
      setDialogMessage("An error occurred during login. Please try again.");
      setDialogOpen(true);
    }
  };
  

  // Handle dialog action
  const handleDialogAction = () => {
    setDialogOpen(false);
    if (dialogType === 'success') {
      navigate("/dashboard");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <img src={prslogo} alt="PRS Logo" className="h-40 mb-4" />
        <h2 className="text-lg font-semibold mb-4">Login into PRS</h2>
        <form className="w-full max-w-md p-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </span>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex justify-center space-x-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-900 font-medium">
            Login as User
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/register-org"
            className="text-gray-500 hover:text-gray-900 font-medium"
          >
            Register Organization
          </Link>
        </div>
      </div>

      {/* Alert Dialog for Success/Error Messages */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === 'success' ? 'Login Successful' : 'Login Failed'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogAction}>
              {dialogType === 'success' ? 'Go to Dashboard' : 'Try Again'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrganizationLogin;