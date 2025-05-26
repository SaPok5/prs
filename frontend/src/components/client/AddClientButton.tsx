import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CLIENTS } from "@/graphql/mutations";
import { FETCH_LATEST_ORG_CLIENT_ID } from "@/graphql/queries";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface AddClientButtonProps {
  onClose: () => void;
}

interface ClientFormData {
  clientid: string;
  clientFullName: string;
  nationality: string;
  contactNO: string;
  email: string;
}

const initialFormData: ClientFormData = {
  clientid: "",
  clientFullName: "",
  nationality: "",
  contactNO: "",
  email: "",
};

export function AddClientButton({ onClose }: AddClientButtonProps) {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: clientIdData,
    loading: clientIdLoading,
    error: clientIdError,
    refetch,
  } = useQuery(FETCH_LATEST_ORG_CLIENT_ID, { fetchPolicy: "network-only" });

  const [createClient, { loading: createLoading }] = useMutation(ADD_CLIENTS);

  useEffect(() => {
    const generateClientId = () => {
      if (clientIdData?.fetchLatestOrganizationClientId) {
        const latestId = clientIdData.fetchLatestOrganizationClientId.clientId;
        const numericPart = parseInt(latestId.replace(/[^\d]/g, ""), 10);
        return numericPart
          ? `cl-${(numericPart + 1).toString().padStart(3, "0")}`
          : "cl-001";
      }
      return "cl-001";
    };

    setFormData((prev) => ({
      ...prev,
      clientid: generateClientId(),
    }));
  }, [clientIdData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof e === "string") {
      // Handle phone input
      setFormData((prev) => ({
        ...prev,
        contactNO: e,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.clientFullName.trim()) {
      setErrorMessage("Client full name is required.");
      setShowErrorDialog(true);
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorDialog(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { data } = await createClient({
        variables: {
          input: {
            clientId: formData.clientid,
            contact: formData.contactNO,
            email: formData.email,
            fullName: formData.clientFullName,
            nationality: formData.nationality,
          },
        },
      });

      if (data.createClient.status.success) {
        setFormData(initialFormData);
        setShowSuccessDialog(true);
        await refetch();
      } else {
        setErrorMessage(
          data.createClient.status.message || "Failed to create client"
        );
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error creating client:", error);
      setErrorMessage("An error occurred while creating the client.");
      setShowErrorDialog(true);
    }
  };

  if (clientIdLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clientIdError) {
    return <div className="text-red-500">Error: {clientIdError.message}</div>;
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
          </DialogHeader>
          <hr className="my-4 border-gray-300" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Client ID */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="clientid"
                  className="text-sm font-medium text-gray-700"
                >
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientid"
                  name="clientid"
                  value={formData.clientid}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                  disabled
                />
              </div>

              {/* Client Full Name */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="clientFullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Client Full Name *
                </label>
                <input
                  type="text"
                  id="clientFullName"
                  name="clientFullName"
                  value={formData.clientFullName}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Nationality */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="nationality"
                  className="text-sm font-medium text-gray-700"
                >
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter nationality"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneInput
                    country="us"
                    value={formData.contactNO}
                    onChange={(phone) => handleInputChange(phone)}
                    enableSearch
                    searchPlaceholder="Search countries..."
                    containerClass="!w-full"
                    inputClass="!w-full !h-10 !p-2 !pl-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    buttonClass="!border-r-0 !border-gray-300 !rounded-l-md !bg-white hover:!bg-gray-50 !h-10 !w-10 !absolute !left-0 !top-0"
                    dropdownClass="!w-full !mt-1 !bg-white !rounded-lg !border !shadow-lg !z-50"
                    searchClass="!p-2 !m-2 !w-[calc(100%-16px)] !border !border-gray-300 !rounded-md"
                    buttonStyle={{ border: "1px solid #e5e7eb" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createLoading}
              >
                {createLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>
              Client has been successfully added.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                onClose();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
