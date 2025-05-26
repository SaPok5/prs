import { useState } from "react";
import { CircleX } from "lucide-react";
import { Plus } from "lucide-react";
import cloud from "../../assets/cloud.png";
import { useDropzone } from "react-dropzone";
import { DayPicker } from "react-day-picker";
import * as Yup from "yup";
import { useFormik } from "formik";
import { BaseApiURL } from "@/constants/ApiUrl";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { addDealPayment } from "@/redux/deal/dealSlice";

const validationSchema = Yup.object({
  receipt: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value: any) => {
      if (!value) return true; // Allow empty
      return value.size <= 5000000; // 5MB limit
    })
    .test("fileType", "Unsupported file type", (value: any) => {
      if (!value) return true;
      return [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ].includes(value.type);
    }),
  remarks: Yup.string().optional(),
  receivedAmount: Yup.number()
    .optional()
    .positive("Received amount must be positive")
    .typeError("Received amount must be a number"),
});
interface SuccessMessage {
  success: boolean;
  message: string;
}

function AddPayment({ dealId }: { dealId: string }) {
  const dispatch = useDispatch();
  const [showAddForm, setShowAddForm] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage | null>(
    null
  );
  console.log(successMessage);

  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      receipt: null,
      remarks: "",
      receivedAmount: "",
      paymentDate: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("dealId", dealId);
        formData.append(
          "paymentDate",
          selectedDate ? selectedDate.toISOString() : ""
        );
        formData.append("receivedAmount", values.receivedAmount || "0");
        formData.append("remarks", values.remarks || "");

        if (file) {
          formData.append("receipt", file);
        }

        const response = await fetch(`${BaseApiURL}/payment/add-payment`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(response, "RESP");

        if (response.ok) {
          // Handle successful submission
          const data = await response.json();
          console.log(data);
          setSuccessMessage(data.status);
          // setFile(null);
          dispatch(addDealPayment({ dealId: data.payment.dealId, payment: data.payment }));
          setTimeout(() => {
            resetForm();

            // formik.resetForm();
            setFile(null);
            setSuccessMessage(null);
            setSelectedDate(null);
            setShowAddForm(false);
          }, 2000);
        } else {
          // Handle error
          const errorData = await response.json();
          console.error("Submission error:", errorData);
        }

        setSubmitting(false);
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitting(false);
      }
    },
  });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setCalendarVisible(false);
    formik.setFieldValue("paymentDate", day.toISOString());
  };

  const handleInputClick = () => {
    setCalendarVisible((prev) => !prev);
  };

  const handleFileChange = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    formik.setFieldValue("receipt", uploadedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
    },

    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const renderFilePreview = () => {
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        return (
          <img
            src={URL.createObjectURL(file)}
            alt="File Preview"
            className="w-full h-full object-contain"
          />
        );
      }
      if (fileType === "application/pdf") {
        return <p className="text-gray-600">PDF File: {file.name}</p>;
      }
    }
    return null;
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const closeForm = () => setShowAddForm(false);

  return (
    <div className="z-20">
      <Button
        className="h-8 w-8 p-0"
        variant="ghost"
        size="sm"
        onClick={toggleAddForm}
      >
        <Plus className="h-4 w-4 text-gray-500 hover:text-gray-700" />
      </Button>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 overflow-y-auto">
          <form
            onSubmit={formik.handleSubmit}
            className="relative space-y-6 p-6 border border-gray-300 rounded-md bg-white shadow-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 sm:mx-6 md:mx-8 overflow-y-auto max-h-[90vh]"
          >
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-left text-gray-800">
                Add Payment
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-red-500 hover:text-red-700 bg-red-100 rounded-full p-2"
              >
                <CircleX className="text-lg" />
              </button>
            </div>

            <hr className="my-4 border-gray-300" />

            {/* Payment Date */}
            <div className="flex flex-col space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                  onClick={handleInputClick}
                  placeholder="Select date"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    text-gray-900 placeholder-gray-400 transition-all duration-300 ease-in-out"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {calendarVisible && (
                <div
                  className="absolute top-full mt-2 z-50 bg-white 
                  rounded-lg shadow-xl border border-gray-200 
                  overflow-hidden animate-fade-in-down"
                >
                  <DayPicker
                    selected={selectedDate || undefined}
                    onDayClick={handleDayClick}
                    mode="single"
                    classNames={{
                      root: "p-4",
                      months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
                      month: "space-y-4",
                      caption: "flex justify-between items-center mb-4",
                      caption_label: "text-lg font-semibold text-gray-800",
                      nav: "flex space-x-1 items-center",
                      nav_button:
                        "hover:bg-gray-100 p-2 rounded-md transition-colors",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "flex font-medium text-gray-500",
                      head_cell: "w-10 text-center p-2",
                      row: "flex w-full",
                      cell: "flex justify-center items-center w-10 h-10 text-center",
                      day: "w-10 h-10 hover:bg-blue-100 hover:text-blue-600 rounded-full cursor-pointer transition-all",
                      day_today: "bg-blue-50 text-blue-600 font-bold",
                      day_selected:
                        "bg-blue-500 text-white hover:bg-blue-600 rounded-full",
                      day_outside: "text-gray-300",
                      day_disabled: "text-gray-300 cursor-not-allowed",
                    }}
                  />
                </div>
              )}
              {formik.touched.paymentDate && formik.errors.paymentDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.paymentDate}
                </div>
              )}
            </div>

            {/* Received Amount */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-600 text-left">
                Received Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter received amount"
                  {...formik.getFieldProps("receivedAmount")}
                />
                <p className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-600">
                  AUD
                </p>
              </div>
              {formik.touched.receivedAmount &&
                formik.errors.receivedAmount && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.receivedAmount}
                  </div>
                )}
            </div>

            {/* File Upload */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-600 text-left mb-2">
                Upload Receipt
              </label>
              <div className="relative w-full">
                <div
                  {...getRootProps()}
                  className="w-full h-40 border border-gray-300 rounded-md text-center flex items-center justify-center cursor-pointer flex-col"
                >
                  <input
                    {...getInputProps()}
                    id="fileUpload"
                    className="hidden"
                  />
                  {file ? (
                    renderFilePreview()
                  ) : (
                    <>
                      <img
                        src={cloud}
                        alt="Upload file"
                        className="h-[60px] w-[60px] p-4 mx-auto"
                      />
                      <span className="text-blue-500 font-bold">
                        Click to upload or drag and drop <br /> SVG, PNG, JPG,
                        or GIF (max. 5MB)
                      </span>
                    </>
                  )}
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    File: {file.name}
                  </p>
                )}
                {formik.touched.receipt && formik.errors.receipt && (
                  <div className="text-sm text-red-500">
                    {formik.errors.receipt as string}
                  </div>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-600 text-left">
                Remarks
              </label>
              <textarea
                {...formik.getFieldProps("remarks")}
                className="w-full h-24 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any remarks"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-6">
              <button
                type="button"
                onClick={closeForm}
                className="border border-blue-500 text-blue-500 px-8 py-3 rounded-md w-48 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium disabled:opacity-50"
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
          {successMessage && successMessage.success && (
            <AlertDialog open={!!successMessage}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {successMessage.success ? "Success" : "Error"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {successMessage.message}
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
        </div>
      )}
    </div>
  );
}

export default AddPayment;
