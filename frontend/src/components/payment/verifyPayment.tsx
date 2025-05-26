import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PAYMENTS } from "@/graphql/queries";
import { EDIT_PAYMENT_STATUS } from "@/graphql/mutations";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServerURL } from "@/constants/ApiUrl";
import { Link } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";

interface TableRow {
  id: string;
  dealId: string;
  dealName: string;
  clientName: string;
  paymentDate: string;
  receivedAmount: string;
  receiptImage: string;
  remarks: string;
  paymentStatus: string;
  editedAt: string;
  createdAt: string;
  updatedAt: string;
  isEdited:string;
}

// const extractFileName = (filePath: string) => {
//   const parts = filePath.split("-");
//   const fileNameWithExtension = parts.slice(1).join("-");
//   return fileNameWithExtension.replace(/\.[^/.]+$/, "");
// };

const VerifyPayment: React.FC = () => {
  // State to manage denial remarks and dialog
  const [denialRemarks, setDenialRemarks] = useState<string>("");
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [isConfirmDenialOpen, setIsConfirmDenialOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");

  // Fetch data from GraphQL using useQuery hook
  const { loading, error, data, refetch } = useQuery(GET_PAYMENTS, {
    variables: { paymentStatus: "PENDING" },
  });

  // Mutation for updating payment status
  const [verifyPayment] = useMutation(EDIT_PAYMENT_STATUS);

  // Handle loading state
  if (loading) return <p>Loading payments...</p>;

  // Handle error state
  if (error) return <p>Error fetching payments: {error.message}</p>;

  // Map the fetched data to table rows
  const tableData: TableRow[] = data.displayPaymentWithStatus.map(
    (payment: any) => ({
      id: payment.id,
      dealId: payment.deal.dealId,
      dealName: payment.deal.dealName,
      clientName: payment.deal.client.fullName,
      paymentDate: payment.paymentDate,
      receivedAmount: payment.receivedAmount,
      receiptImage: payment.receiptImage,
      remarks: payment.remarks,
      paymentStatus: payment.paymentStatus,
      editedAt: payment.editedAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      isEdited:payment.isEdited,
    })
  );

  const handleStatusChange = (
    paymentId: string,
    newStatus: string,
    remarks?: string
  ) => {
    verifyPayment({
      variables: {
        paymentStatus: newStatus,
        paymentId,
        remarks: remarks || "",
      },
      onCompleted: (data) => {
        console.log("Payment status updated:", data);

        // Set dialog message based on status
        if (newStatus === "VERIFIED") {
          setDialogTitle("Payment Verified");
          setDialogMessage("The payment has been successfully verified.");
        } else if (newStatus === "DENIED") {
          setDialogTitle("Payment Denied");
          setDialogMessage("The payment has been denied.");
        }

        // Open success dialog
        setIsSuccessDialogOpen(true);

        // Reset states
        setDenialRemarks("");
        setCurrentPaymentId(null);
        setIsConfirmDenialOpen(false);

        // Refetch the payments to update the list
        refetch();
      },
      onError: (error) => {
        console.error("Error updating payment status:", error);

        // Set error dialog
        setDialogTitle("Error");
        setDialogMessage(`Failed to update payment status: ${error.message}`);
        setIsSuccessDialogOpen(true);
      },
    });
  };

  const openDenialDialog = (paymentId: string) => {
    setCurrentPaymentId(paymentId);
    setIsConfirmDenialOpen(true);
  };

  return (
    <div className="p-2 bg-gray-100 h-screen w-[1650px]">
      <Table className="min-w-full bg-white border border-gray-200 rounded-md mt-4">
        <TableHeader>
          <TableRow className="bg-white-100 text-white-600 uppercase text-sm leading-normal">
            <TableHead className="py-3 px-6 text-center">Deal ID</TableHead>
            <TableHead className="py-3 px-6 text-center">Deal Name</TableHead>
            <TableHead className="py-3 px-6 text-center">Client Name</TableHead>
            <TableHead className="py-3 px-6 text-center">Payment Date</TableHead>
            <TableHead className="py-3 px-6 text-center">
              Received Amount
            </TableHead>
            <TableHead className="py-3 px-6 text-center">Receipt Image</TableHead>
            <TableHead className="py-3 px-6 text-center">Remarks</TableHead>
            <TableHead className="py-3 px-6 text-center">
              Payment Status
            </TableHead>
            <TableHead className="py-3 px-6 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              className="text-sm leading-normal bg-orange-100"
            >
              <TableCell className="py-3 px-6 text-center">{row.dealId}</TableCell>
              <TableCell className="py-3 px-6 text-center">{row.dealName}</TableCell>
              <TableCell className="py-3 px-6 text-center">{row.clientName}</TableCell>
              <TableCell className="py-3 px-6 text-center">{row.paymentDate}</TableCell>
              <TableCell className="py-3 px-6 text-center">{row.receivedAmount}</TableCell>
              <TableCell className="py-3 px-6 text-center">
                {" "}
                <Link
                  to={`${ServerURL}/${row.receiptImage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View
                </Link>{" "}
              </TableCell>
              <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                {row.remarks}
              </TableCell>
              <TableCell className="py-3 px-6 text-center">{row.paymentStatus}{row.isEdited && <span className="text-gray-500 text-xs">(edited)</span>}</TableCell>
              <TableCell className="flex gap-3 py-3 px-6 text-center">
                {/* Verify Payment Dialog */}
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(row.id, "VERIFIED")}
                  className="text-green-900 hover:text-green-500"
                >
                  <CircleCheck  />
                </Button>

                {/* Deny Payment Button */}
                <Button
                  variant="outline"
                  onClick={() => openDenialDialog(row.id)}
                    className="text-red-600 hover:text-red-500"
                >
                  {/* <img src={X} alt="denied" /> */}
                  <CircleX />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Denial Remarks Dialog */}
      <AlertDialog
        open={isConfirmDenialOpen}
        onOpenChange={setIsConfirmDenialOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deny Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide remarks for denying this payment
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="denial-remarks" className="text-right">
                Remarks
              </Label>
              <Input
                id="denial-remarks"
                value={denialRemarks}
                onChange={(e) => setDenialRemarks(e.target.value)}
                placeholder="Enter reason for denial"
                className="col-span-3"
                required
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDenialOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (currentPaymentId && denialRemarks.trim()) {
                  handleStatusChange(currentPaymentId, "DENIED", denialRemarks);
                } else {
                  alert("Remarks are required for denial");
                }
              }}
              disabled={!denialRemarks.trim()}
            >
              Deny Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success/Error Dialog */}
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VerifyPayment;
