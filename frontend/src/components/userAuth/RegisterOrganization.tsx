import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import prslogo from "@/assets/prslogo.png";
import { REGISTER_ORG, VERIFY_REGISTRATION_OTP } from "@/graphql/mutation/organization.mutation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validation Schemas
const validationSchema = Yup.object({
  organizationName: Yup.string()
    .required("Organization Name is required")
    .min(2, "Organization name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match")
});

const verificationFormSchema = Yup.object({
  verificationCode: Yup.string()
    .required("Verification code is required")
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers")
});

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const tempEmail = localStorage.getItem("tempEmail");
  const [showVerification, setShowVerification] = useState(false);

  const [registerOrg, { loading }] = useMutation(REGISTER_ORG);
  const [verifyRegistrationOtp, { loading: verificationLoading }] = useMutation(VERIFY_REGISTRATION_OTP);

  // Show verification if temp email exists
  useEffect(() => {
    if (tempEmail) setShowVerification(true);
  }, [tempEmail]);

  // OTP Formik
  const verificationFormik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema: verificationFormSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyRegistrationOtp({
          variables: {
            input: {
              email: tempEmail,
              otp: values.verificationCode
            }
          }
        });

        const verifyData = response?.data?.verifyOrganizationRegistrationOtp;

        if (verifyData?.success) {
          localStorage.removeItem("tempEmail");
          setShowVerification(false);
          alert("Registration successful!");
          navigate("/organizationLogin");
        } else {
          alert(verifyData?.message || "Verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        alert("An error occurred during verification.");
      }
    },
  });

  // Main Registration Formik
  const formik = useFormik({
    initialValues: {
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await registerOrg({
          variables: {
            organizationName: values.organizationName,
            email: values.email,
            password: values.password
          }
        });

        console.log("GraphQL response:", response);

        const registerData = response?.data?.registerOrganization;

        if (registerData?.success) {
          localStorage.setItem("tempEmail", values.email);
          setShowVerification(true);
        } else {
          alert(registerData?.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration.");
      }
    }
  });

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <img src={prslogo} alt="PRS Logo" className="h-40 mb-4" />
            <h2 className="text-2xl font-bold">Register Organization</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.organizationName}
                  placeholder="Enter organization name"
                  className={formik.touched.organizationName && formik.errors.organizationName ? "border-red-500" : ""}
                />
                {formik.touched.organizationName && formik.errors.organizationName && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.organizationName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Enter your email"
                  className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Enter your password"
                  className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  placeholder="Confirm your password"
                  className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formik.isValid || !formik.dirty}
            >
              {loading ? "Registering..." : "Register Organization"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link to="/organizationLogin" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Already have an account? Login here
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={verificationFormik.handleSubmit} className="space-y-4">
            <div>
              {tempEmail && <p>Verification code sent to {tempEmail}</p>}
              <Label htmlFor="verificationCode">Enter Verification Code</Label>
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                onChange={verificationFormik.handleChange}
                onBlur={verificationFormik.handleBlur}
                value={verificationFormik.values.verificationCode}
                placeholder="Enter 6-digit code"
                className={verificationFormik.touched.verificationCode && verificationFormik.errors.verificationCode ? "border-red-500" : ""}
              />
              {verificationFormik.touched.verificationCode && verificationFormik.errors.verificationCode && (
                <p className="mt-1 text-sm text-red-500">{verificationFormik.errors.verificationCode}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={!verificationFormik.isValid || !verificationFormik.dirty || verificationLoading}>
                {verificationLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterOrganization;
