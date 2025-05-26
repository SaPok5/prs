import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/redux/auth/authSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// GraphQL mutation for changing the password
const CHANGE_OrgPASSWORD_MUTATION = gql`
mutation ChangeOrganizationPassword($input: ChangePw!) {
  changeOrganizationPassword(input: $input) {
    status {
      success
      message
    }
    organization {
      id
      organizationName
      email
    }
  }
}
`;

function OrgChangePassword() {
    const organizationId = useSelector(selectOrganizationId);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    const [dialogState, setDialogState] = useState({
        open: false,
        title: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    const [changePassword] = useMutation(CHANGE_OrgPASSWORD_MUTATION);

    const [passwordVisibility, setPasswordVisibility] = useState({
        oldPassword: false,
        password: false,
        confirmPassword: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            setDialogState({
                open: true,
                title: "Error",
                description: "New password and confirm password must match.",
            });
            return;
        }

        if (!organizationId) {
            setDialogState({
                open: true,
                title: "Error",
                description: "Organization ID not found. Please log in again.",
            });
            return;
        }

        const input = {
            oldPassword: passwordData.oldPassword,
            password: passwordData.password,
            confirmPassword: passwordData.confirmPassword,
            organizationId,
        };

        try {
            setLoading(true);
            const response = await changePassword({ variables: { input } });

            if (response?.data?.changeOrganizationPassword?.status?.success) {
                setDialogState({
                    open: true,
                    title: "Success",
                    description:
                        response.data.changeOrganizationPassword.status.message ||
                        "Password changed successfully.",
                });
                setPasswordData({
                    oldPassword: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                setDialogState({
                    open: true,
                    title: "Error",
                    description:
                        response?.data?.changeOrganizationPassword?.status?.message ||
                        "An error occurred. Please try again.",
                });
            }
        } catch (err: any) {
            setDialogState({
                open: true,
                title: "Error",
                description: err?.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex space-y-6 mb-10">
            <div className="bg-white p-8 rounded-lg shadow w-96"> {/* Reduced width */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4 relative">
                        <label htmlFor="oldPassword" className="text-sm font-medium">
                            Old Password
                        </label>
                        <input
                            type={passwordVisibility.oldPassword ? "text" : "password"}
                            name="oldPassword"
                            id="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Current Password"
                            autoComplete="off"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("oldPassword")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label="Toggle Old Password Visibility"
                        >
                            {passwordVisibility.oldPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
    
                    <div className="flex flex-col mb-4 relative">
                        <label htmlFor="password" className="text-sm font-medium">
                            New Password
                        </label>
                        <input
                            type={passwordVisibility.password ? "text" : "password"}
                            name="password"
                            id="password"
                            value={passwordData.password}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter New Password"
                            autoComplete="off"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label="Toggle New Password Visibility"
                        >
                            {passwordVisibility.password ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
    
                    <div className="flex flex-col mb-4 relative">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            type={passwordVisibility.confirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Confirm Password"
                            autoComplete="off"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label="Toggle Confirm Password Visibility"
                        >
                            {passwordVisibility.confirmPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
    
                    <div className="flex justify-center space-x-6 mt-4">
                        <Button
                            className="bg-blue-500 text-white px-8 py-3 rounded-md w-40 text-sm font-medium"
                            type="submit"
                            disabled={loading}
                        >
                            Change
                        </Button>
                    </div>
                </form>
            </div>
            {/* Alert Dialog */}
            <AlertDialog open={dialogState.open} onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogState.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setDialogState((prev) => ({ ...prev, open: false }))}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default OrgChangePassword;
