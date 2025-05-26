import { useState, FormEvent } from "react";
import { Eye, EyeClosed, RectangleEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

// Define the GraphQL mutation
const CHANGE_PASSWORD_MUTATION = gql`
mutation ChangePassword($input: ChangePwInput) {
  changePassword(input: $input) {
    data {
      id
    }
    status {
      success
      message
    }
  }
}
`;

interface ChangePasswordProps {
    id: string;
    onSuccess?: () => void;
}

export function ChangeUserPassword({ id, onSuccess }: ChangePasswordProps) {
    const [passwordData, setPasswordData] = useState({
        // oldPassword: "",
        confirmPassword: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState({
        // oldPassword: false,
        password: false,
        confirmPassword: false,
    });
    const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION);

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            setErrorMessage("New password and confirm password must match.");
            return;
        }

        try {
            console.log("Sending input to server:", {
                userId: id,
                // oldPassword: passwordData.oldPassword,
                password: passwordData.password,
                confirmPassword: passwordData.confirmPassword,
            });

            const { data } = await changePassword({
                variables: {
                    input: {
                        userId: id,
                        // oldPassword: passwordData.oldPassword,
                        password: passwordData.password,
                        confirmPassword: passwordData.confirmPassword,
                    },
                },
            });

            console.log("Server response:", data);

            if (data?.changePassword?.status?.success) {
                alert("Password changed successfully!");
                setErrorMessage("");

                // Clear the form fields
                setPasswordData({
                    // oldPassword: "",
                    confirmPassword: "",
                    password: "",
                });

                if (onSuccess) onSuccess();
            } else {
                setErrorMessage(data?.changePassword?.status?.message || "Failed to change password.");
            }
        } catch (err: any) {
            console.error("Error changing password:", err);
            setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
        }
    };



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className=" h-8 w-8 p-0"
                    aria-label="Change Password"
                >
                    <RectangleEllipsis className="h-7 w-7 text-gray-500 hover:text-gray-700" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <hr className="my-4 border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    {/* Old Password */}
                    {/* <div className="flex flex-col relative">
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
                            placeholder="Enter your current password"
                            autoComplete="off" 
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("oldPassword")}
                            className="absolute right-3 top-1/2 transform -translate-y-6/2"
                            aria-label="Toggle Old Password Visibility"
                        >
                            {passwordVisibility.oldPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div> */}

                    {/* New Password */}
                    <div className="flex flex-col relative">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            type={passwordVisibility.password ? "text" : "password"}
                            name="password"
                            id="password"
                            value={passwordData.password}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter a new password"
                            autoComplete="off" 
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            className="absolute right-3 top-1/2 transform -translate-y-6/2"
                            aria-label="Toggle New Password Visibility"
                        >
                            {passwordVisibility.password ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col relative">
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
                            placeholder="Confirm your new password"
                            autoComplete="off" 
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                            className="absolute right-3 top-1/2 transform -translate-y-6/2"
                            aria-label="Toggle Confirm Password Visibility"
                        >
                            {passwordVisibility.confirmPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>


                    <DialogFooter>
                        <div className="flex justify-center items-center mt-6">
                            <Button
                                className="bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Change Password"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
