import React from "react";
import { X } from "lucide-react";
import { MonthInput, MonthPicker } from "react-lite-month-picker";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface MonthData {
  month: number;
  year: number;
  label?: string;
}

interface OfferData {
  target: string;
  bonus: string;
  offer: string;
  selectedMonthData: MonthData;
  remarks: string;
}

interface AddOfferModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  offer: OfferData;
  setOffer: React.Dispatch<React.SetStateAction<OfferData>>;
  handleAddOffer: (values: OfferData) => void;
  setIsPickerOpen: (isOpen: boolean) => void;
  isPickerOpen: boolean;
}

const validationSchema = Yup.object().shape({
  target: Yup.number()
    .typeError("Target must be a number")
    .required("Target is required")
    .test("is-float", "Target must be a valid number", (value) =>
      value === undefined || !isNaN(parseFloat(String(value)))
    ),
  bonus: Yup.number()
    .typeError("Bonus must be a number")
    .required("Bonus is required")
    .test("is-float", "Bonus must be a valid number", (value) =>
      value === undefined || !isNaN(parseFloat(String(value)))
    ),
  offer: Yup.number()
    .typeError("Offer percentage must be a number")
    .required("Offer percentage is required")
    .test("is-float", "Offer percentage must be a valid number", (value) =>
      value === undefined || !isNaN(parseFloat(String(value)))
    )
    .min(0, "Offer percentage must be greater than or equal to 0")
    .max(100, "Offer percentage must be less than or equal to 100"),
  remarks: Yup.string(),
});

const AddOfferModal: React.FC<AddOfferModalProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  offer,
  setOffer,
  handleAddOffer,
  setIsPickerOpen,
  isPickerOpen,
}) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<"success" | "error" | null>(null);

  if (!isAddModalOpen) return null;

  const closeAlertDialog = () => {
    setIsAlertOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <Formik
          initialValues={offer}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values, "values");
            try {
              handleAddOffer(values);

              // Success message handling
              setAlertMessage("Offer added successfully!");
              setAlertType("success");
              setIsAlertOpen(true);

              // Automatically close the alert after 3 seconds
              setTimeout(closeAlertDialog, 3000);
            } catch (error) {
              // Error message handling
              setAlertMessage("Failed to add offer. Please try again.");
              setAlertType("error");
              setIsAlertOpen(true);

              // Automatically close the alert after 3 seconds
              setTimeout(closeAlertDialog, 3000);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Add New Offer</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <Field
                      name="target"
                      type="number"
                      step="any"
                      placeholder="Enter target"
                      className={`w-full px-4 py-2 border ${
                        errors.target && touched.target ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                    <ErrorMessage
                      name="target"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bonus
                    </label>
                    <Field
                      name="bonus"
                      type="number"
                      step="any"
                      placeholder="Enter bonus amount"
                      className={`w-full px-4 py-2 border ${
                        errors.bonus && touched.bonus ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                    <ErrorMessage
                      name="bonus"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Percentage
                    </label>
                    <div className="relative">
                      <Field
                        name="offer"
                        type="number"
                        step="any"
                        placeholder="Enter offer percentage"
                        className={`w-full px-4 py-2 border ${
                          errors.offer && touched.offer ? "border-red-500" : "border-gray-200"
                        } rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                    <ErrorMessage
                      name="offer"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <div
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MonthInput
                        selected={offer.selectedMonthData}
                        setShowMonthPicker={setIsPickerOpen}
                        showMonthPicker={isPickerOpen}
                      />
                    </div>
                    {isPickerOpen && (
                      <div className="relative mt-1">
                        <MonthPicker
                          setIsOpen={setIsPickerOpen}
                          selected={offer.selectedMonthData}
                          onChange={(data: MonthData) =>
                            setOffer((prev) => ({
                              ...prev,
                              selectedMonthData: data,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <Field
                      as="textarea"
                      name="remarks"
                      placeholder="Add any additional remarks"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Alert Dialog */}
      {isAlertOpen && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {alertType === "success" ? "Success" : "Error"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeAlertDialog}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction onClick={closeAlertDialog}>
                Ok
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AddOfferModal;
