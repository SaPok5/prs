import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { USER_LOGIN } from "@/graphql/mutations";
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

const UserLogin = () => {
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
  const [login, { loading }] = useMutation(USER_LOGIN);
  const navigate = useNavigate();

  // State for managing dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
  
      const loginData = response.data.userLogin;
      console.log(loginData, "login data");
  
      if (loginData.status.success) {
       
        dispatch(setCredentials({
          token: loginData.token,
          email: loginData.user.email,
          role: loginData.role,
          userId: loginData.user.userId,
          fullName: loginData.user.fullName,
          id: loginData.user.id,
          teamId: loginData.user.team?.id
        }));
  
     
        if(loginData.role === 'verifier'){navigate("/verifier-dashboard");}else{navigate("/dashboard");}
      } else {
        
        setDialogType('error');
        setDialogMessage(loginData.status.message);
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
        <img
          src={prslogo}
          alt="PRS Logo"
          className="h-40 mb-4"
        />

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

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p>
          <Link to="/organizationLogin">
            <b>Login as Organization</b>
          </Link>
        </p>
      </div>

      Alert Dialog for Success/Error Messages
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

export default UserLogin;