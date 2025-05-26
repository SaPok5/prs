import { useState, useEffect } from "react";
// import { ChooseDate } from "../date/ChooseDate";
import { useDropzone } from "react-dropzone";
import cloud from "../../assets/cloud.png";
import { Button } from "@/components/ui/button";
// import { useMutation } from "@apollo/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useFormik } from "formik";
import * as Yup from "yup";
import { BaseApiURL } from "@/constants/ApiUrl";
import { useQuery } from "@apollo/client";
import { FetchLatestOrganizationDealId } from "@/graphql/query/deal.query";
import { GET_USER_CLIENT_DROPDOWN } from "@/graphql/query/client.query";
import { GET_WORKTYPES } from "@/graphql/query/work-type.query";
import { GET_SOURCE_TYPE } from "@/graphql/query/source-type.query";
// import { GET_USERS_DEALS } from "@/graphql/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
} from "@/redux/auth/authSlice";
import { addDeal } from "@/redux/deal/dealSlice";

// Enhanced validation schema
const validationSchema = Yup.object({
  dealId: Yup.string().optional(),
  dealName: Yup.string().required("Deal name is required"),
  clientId: Yup.string().required("Client selection is required"),
  workTypeId: Yup.string().required("Work type is required"),
  sourceTypeId: Yup.string().required("Source type is required"),
  dealValue: Yup.number()
    .required("Deal value is required")
    .positive("Deal value must be positive"),
  dealDate: Yup.date().nullable().required("Deal date is required"),
  dueDate: Yup.date()
    .nullable()
    .required("Due date is required")
    .min(Yup.ref("dealDate"), "Due date can't be before deal date"),
  remarks: Yup.string().required("Remarks is required"),
  paymentDate: Yup.date().required("Payment Date is required"),
  receivedAmount: Yup.number()
    .required("Insert received amount")
    .positive("Received amount must be positive")
    .max(Yup.ref("dealValue"), "Received amount cannot exceed deal value"),

  paymentRemarks: Yup.string().required("Payment remarks is required"),
  receipt: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value: any) => {
      if (!value) return true;
      return value.size <= 5000000;
    })
    .test("fileType", "Unsupported file type", (value: any) => {
      if (!value) return true;
      return [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ].includes(value.type);
    })
    .required("Receipt File is required"),
});

export function AddDeal({ onClose }: any) {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const token = useSelector(selectCurrentToken);
  const [latestDealId, setLatestDealId] = useState<string>("");

  const { data, refetch } = useQuery(
    FetchLatestOrganizationDealId,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (data && data.fetchLatestOrganizationDealId) {
      const latestNumber =
        data.fetchLatestOrganizationDealId.dealId.split("-")[1];
      setLatestDealId(`dl-${Number(latestNumber) + 1}`);
    } else {
      setLatestDealId("dl-1");
    }
  }, [data]);

  const { data: clientsData } =
    useQuery(GET_USER_CLIENT_DROPDOWN);
  const { data: workTypeData} =
    useQuery(GET_WORKTYPES);
  const { data: sourceTypeData } =
    useQuery(GET_SOURCE_TYPE);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      dealName: "",
      clientId: "",
      workTypeId: "",
      sourceTypeId: "",
      dealValue: "",
      dealDate: null,
      dueDate: null,
      remarks: "",
      paymentDate: null,
      receivedAmount: "",
      paymentRemarks: "",
      receipt: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const formData = new FormData();
        formData.append("dealId", latestDealId);
        formData.append("dealName", values.dealName);
        formData.append("clientId", values.clientId);
        formData.append("workTypeId", values.workTypeId);
        formData.append("sourceTypeId", values.sourceTypeId);
        formData.append("dealValue", values.dealValue);
        formData.append("dealDate", values.dealDate || "");
        formData.append("dueDate", values.dueDate || "");
        formData.append("remarks", values.remarks || "");
        formData.append("paymentDate", values.paymentDate || "");
        formData.append("receivedAmount", values.receivedAmount || "");
        formData.append("paymentRemarks", values.paymentRemarks || "");

        if (file) {
          formData.append("receipt", file);
        }

        const response = await fetch(`${BaseApiURL}/deals/add-deals`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(addDeal(data.data.deal));
          setSuccessMessage(`${data.status.message}`);

          // Close both alert and modal after 2 seconds
          setTimeout(() => {
            formik.resetForm();
            setFile(null);
            setSuccessMessage(null);
            onClose(); // This will close the main modal
          }, 2000);

          await refetch();
        } else {
          const errorData = await response.json();
          const errorMessage =
            errorData.status?.message ||
            "Failed to add deal. Please try again.";
          setSuccessMessage(errorMessage);

          // Close both alert and modal after error message as well
          setTimeout(() => {
            formik.resetForm();
            setFile(null);
            setSuccessMessage(null);
            onClose(); // This will close the main modal
          }, 2000);
        }
      } catch (err) {
        console.error("Error creating deal:", err);
        setSuccessMessage("Error creating deal. Please try again.");

        // Close both for error case too
        setTimeout(() => {
          formik.resetForm();
          setFile(null);
          setSuccessMessage(null);
          onClose(); // This will close the main modal
        }, 2000);
      } finally {
        setSaving(false);
      }
    },
  });
  useEffect(() => {
    console.log("Current Formik Values:", formik.values);
  }, [formik.values]);

  const handleFileChange = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (uploadedFile.type.startsWith("image/")) {
      const fileWithPreview = Object.assign(uploadedFile, {
        preview: URL.createObjectURL(uploadedFile),
      });
      formik.setFieldValue("receipt", fileWithPreview);
    } else {
      formik.setFieldValue("receipt", uploadedFile);
    }

    // const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5000000,
  });

  const renderFilePreview = () => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="File Preview"
          className="w-full h-full object-contain"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-600">
          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
        </p>
      </div>
    );
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          formik.resetForm();
          setFile(null);
          setSuccessMessage(null);
          onClose();
        }
      }}
    >
      {/* <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Plus className="mr-2" /> Add Deal
        </Button>
      </DialogTrigger> */}

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Please fill in the details for the new deal and click save when
            done.
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="p-4 mb-4 bg-green-100 text-green-700 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Serial No and Deal Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="dealId" className="text-sm font-medium">
                Deal ID
              </label>
              <input
                type="text"
                id="dealId"
                {...formik.getFieldProps("dealId")}
                value={latestDealId}
                className="w-full h-10 border p-2 rounded-md"
                placeholder="M-5327"
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="dealName" className="text-sm font-medium">
                Deal Name
              </label>
              <input
                type="text"
                id="dealName"
                {...formik.getFieldProps("dealName")}
                className="w-full h-10 border p-2 rounded-md"
                placeholder="Enter Deal Name"
              />
              {formik.touched.dealName && formik.errors.dealName && (
                <p className="text-red-600 text-sm">{formik.errors.dealName}</p>
              )}
            </div>
          </div>

          {/* Client and Work Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="clientId" className="text-sm font-medium">
                Client's Name
              </label>
              <select
                id="clientId"
                {...formik.getFieldProps("clientId")}
                className="w-full h-10 p-2 border rounded-md"
              >
                <option value="">Select Client</option>
                {clientsData?.getUserClient?.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
              {formik.touched.clientId && formik.errors.clientId && (
                <p className="text-red-600 text-sm">{formik.errors.clientId}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="workTypeId" className="text-sm font-medium">
                Work Type
              </label>
              <select
                id="workTypeId"
                {...formik.getFieldProps("workTypeId")}
                className="w-full h-10 p-2 border rounded-md"
              >
                <option value="">Select Work Type</option>
                {workTypeData?.workTypes.data.map((workType: any) => (
                  <option key={workType.id} value={workType.id}>
                    {workType.name}
                  </option>
                ))}
              </select>
              {formik.touched.workTypeId && formik.errors.workTypeId && (
                <p className="text-red-600 text-sm">
                  {formik.errors.workTypeId}
                </p>
              )}
            </div>
          </div>

          {/* Source Type and Deal Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="sourceTypeId" className="text-sm font-medium">
                Source Type
              </label>
              <select
                id="sourceTypeId"
                {...formik.getFieldProps("sourceTypeId")}
                className="w-full h-10 p-2 border rounded-md"
              >
                <option value="">Select Source</option>
                {sourceTypeData?.sourceTypes.data.map((sourceType: any) => (
                  <option key={sourceType.id} value={sourceType.id}>
                    {sourceType.name}
                  </option>
                ))}
              </select>
              {formik.touched.sourceTypeId && formik.errors.sourceTypeId && (
                <p className="text-red-600 text-sm">
                  {formik.errors.sourceTypeId}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="dealValue" className="text-sm font-medium">
                Deal Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="dealValue"
                  {...formik.getFieldProps("dealValue")}
                  className="w-full h-10 border p-2 pr-16 rounded-md"
                  placeholder="Enter Deal Value"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                  AUD
                </span>
              </div>
              {formik.touched.dealValue && formik.errors.dealValue && (
                <p className="text-red-600 text-sm">
                  {formik.errors.dealValue}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Deal Date</label>

              <Calendar
                mode="single"
                selected={formik.values.dealDate || undefined}
                onSelect={(date) =>
                  formik.setFieldValue("dealDate", date || null)
                }
                className="rounded-md border"
              />
              {/* <ChooseDate
                value={formik.values.dealDate}
                onChange={handleDateChange("dealDate")}
              /> */}
              {formik.touched.dealDate && formik.errors.dealDate && (
                <p className="text-red-600 text-sm">{formik.errors.dealDate}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Due Date</label>
              <Calendar
                mode="single"
                selected={formik.values.dueDate || undefined}
                onSelect={(date) =>
                  formik.setFieldValue("dueDate", date || null)
                }
                className="rounded-md border"
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <p className="text-red-600 text-sm">{formik.errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label htmlFor="remarks" className="text-sm font-medium">
              Remarks
            </label>
            <textarea
              id="remarks"
              {...formik.getFieldProps("remarks")}
              className="w-full h-24 border p-2 rounded-md"
              placeholder="Enter remarks here"
            />
            {formik.touched.remarks && formik.errors.remarks && (
              <p className="text-red-600 text-sm">{formik.errors.remarks}</p>
            )}
          </div>

          {/* First Payment Section */}
          <h2 className="text-xl font-bold">First Payment</h2>
          <hr className="my-4 border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Payment Date</label>
              <Calendar
                mode="single"
                selected={formik.values.paymentDate || undefined}
                onSelect={(date) =>
                  formik.setFieldValue("paymentDate", date || null)
                }
                className="rounded-md border"
              />
              {/* <ChooseDate
                value={formik.values.paymentDate}
                onChange={handleDateChange("paymentDate")}
              /> */}

              {formik.touched.paymentDate && formik.errors.paymentDate && (
                <p className="text-red-600 text-sm">
                  {formik.errors.paymentDate}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="receivedAmount" className="text-sm font-medium">
                Received Amount
              </label>
              <div className="relative">
                <input
                  type="text" // Changed from "number" to "text"
                  id="receivedAmount"
                  {...formik.getFieldProps("receivedAmount")}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
                    const value = e.target.value.replace(/[^\d.]/g, "");
                    // Ensure only one decimal point
                    const parts = value.split(".");
                    if (parts.length > 2) {
                      return;
                    }
                    // Update formik value with the parsed number or empty string
                    formik.setFieldValue(
                      "receivedAmount",
                      value === "" ? "" : value
                    );
                  }}
                  className="w-full h-10 border p-2 pr-16 rounded-md"
                  placeholder="Enter Amount"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                  AUD
                </span>
              </div>
              {formik.touched.receivedAmount &&
                formik.errors.receivedAmount && (
                  <p className="text-red-600 text-sm">
                    {formik.errors.receivedAmount}
                  </p>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Receipt</label>
            <div
              {...getRootProps()}
              className="w-full h-40 border border-gray-300 rounded-md text-center flex items-center justify-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {file ? (
                renderFilePreview()
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={cloud}
                    alt="Upload"
                    className="h-[60px] w-[60px] p-4"
                  />
                  <span className="text-blue-500 font-bold">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-sm text-gray-500">
                    (Max size: 5MB, Images or PDF)
                  </span>
                </div>
              )}
            </div>
            {formik.touched.receipt && formik.errors.receipt && (
              <p className="text-red-600 text-sm">{formik.errors.receipt}</p>
            )}
          </div>
          {/* Additional Remarks */}
          <div className="space-y-2">
            <label htmlFor="paymentRemarks" className="text-sm font-medium">
              Additional Remarks
            </label>
            <textarea
              id="paymentRemarks"
              {...formik.getFieldProps("paymentRemarks")}
              className="w-full h-24 border p-2 rounded-md"
              placeholder="Additional remarks"
            />
             {formik.touched.paymentRemarks && formik.errors.paymentRemarks && (
                <p className="text-red-600 text-sm">
                  {formik.errors.paymentRemarks}
                </p>
              )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                setFile(null);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button disabled={saving} type="submit" className="bg-blue-600">
              {" "}
              {saving ? "Saving..." : "Save Deal"}
            </Button>
          </DialogFooter>
        </form>
        {successMessage && (
          <AlertDialog open={!!successMessage}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {successMessage.includes("success") ? "Success!" : "Error"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {successMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setSuccessMessage(null)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
