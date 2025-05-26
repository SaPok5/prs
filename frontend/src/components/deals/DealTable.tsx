import { useEffect, useState } from "react";
import {
  ChevronsUpDown,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS_DEALS } from "@/graphql/queries";
import { DELETE_PAYMENT } from "@/graphql/queries";
import AddPayment from "./AddPayment";
import EditPayment from "@/models/editPayment";
import EditDeal from "../deals_view/EditDealButton";
import { DELETE_DEAL } from "@/graphql/query/deal.query";
import { Button } from "../ui/button";
import { ServerURL } from "@/constants/ApiUrl";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthRole, selectUserId } from "@/redux/auth/authSlice";
import { removeDeal, selectDealsList, setDeals } from "@/redux/deal/dealSlice";
import { Deal, DealPayment } from "@/types/deal.types";
import { format } from "date-fns";

// interface Deal {
//   id: string;
//   dealId: string;
//   dealName: string;
//   clientId: string;
//   dealDate: string;
//   dueDate: string;
//   remarks: string;
//   dealValue: number;
//   payments: Payment[];
//   client: Client;
//   user: User;
//   isEdited: boolean;
// }

interface DealTableProps {
  searchTerm: string;
  filter: string;
  user: string | null;
}

const DealTable: React.FC<DealTableProps> = ({ searchTerm, filter, user }) => {
  const dispatch = useDispatch();
  const [deleteDeal] = useMutation(DELETE_DEAL);
  const [deletePayment] = useMutation(DELETE_PAYMENT);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showDeletePaymentDialog, setShowDeletePaymentDialog] = useState(false);
  const [showDeleteDealDialog, setShowDeleteDealDialog] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  // const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
  //   null
  // );
  const [showEditDeal, setShowEditDeal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<{
    id: string;
    paymentDate: string;
    receivedAmount: number;
    receiptImage: string;
    remarks: string;
    paymentStatus: string;
    createdAt: string;
    editedAt: string | null;
    verifier?:
      | { email: string; fullName: string; id: string; userId: string }
      | undefined;
    verifierId?: string | undefined;
  } | null>(null);

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const role = useSelector(selectAuthRole);
  const deals: Deal[] = useSelector(selectDealsList);

  const userId =
    role !== "admin" && role !== "verifier" ? useSelector(selectUserId) : null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { loading, error, data, refetch } = useQuery(GET_USERS_DEALS, {
    variables: {
      userId: user || userId,
      filter,
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchTerm || undefined,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (userId && filter) {
      refetch();
    }
  }, [filter, userId, refetch]);

  useEffect(() => {
    if (data?.dealsOfUser?.deals) {
      dispatch(setDeals(data.dealsOfUser.deals.deals));
    }
  }, [dispatch, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching deals: {error.message}</p>;

  // const deals: Deal[] = data.dealsOfUser.deals;

  const handleDeletePayment = (paymentId: string) => {
    setItemToDelete(paymentId);
    setShowDeletePaymentDialog(true);
  };

  const handleEditDeal = (id: string) => {
    const selectedDeal = deals.find((deal: any) => deal.id === id);
    if (selectedDeal) {
      setShowEditDeal(true);
      setSelectedDeal(selectedDeal);
    }
  };

  const handleEditPayment = (payment: DealPayment) => {
    console.log("Editing payment data:", payment);
    // setSelectedPaymentId(payment.id);
    setShowEditPaymentModal(true);

    setSelectedPayment({
      id: payment.id,
      paymentDate: payment.paymentDate,
      receivedAmount: parseFloat(payment.receivedAmount),
      receiptImage: payment.receiptImage,
      remarks: payment.remarks || "",
      paymentStatus: payment.paymentStatus,
      createdAt: payment.createdAt,
      editedAt: null,
      // verifier: payment.verifier || undefined,
      verifierId: payment.verifierId || undefined,
    });
  };
  const confirmDeletePayment = () => {
    deletePayment({
      variables: {
        deletePaymentId: String(itemToDelete),
      },
      refetchQueries: [
        {
          query: GET_USERS_DEALS,
          variables: { userId: user || userId, filter },
        },
      ],
    })
      .then((response) => {
        if (response.data.deletePayment.status.success) {
          setAlertMessage("Payment deleted successfully!");
          setAlertType("success");
        } else {
          setAlertMessage("Failed to delete the payment.");
          setAlertType("error");
        }
        setShowAlertDialog(true);
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        setAlertMessage("An error occurred while deleting the payment.");
        setAlertType("error");
        setShowAlertDialog(true);
      });
    setShowDeletePaymentDialog(false);
  };

  const filteredDeals =
    deals?.filter(
      (deal) =>
        deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.dealId!.toString().includes(searchTerm)
    ) || [];
  console.log(data);

  const totalPages = data.dealsOfUser.deals.totalPages || 0;
  const totalDeals = data.dealsOfUser.deals.totalCount || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const deleteDealWithID = (dealId: string) => {
    setItemToDelete(dealId);
    setShowDeleteDealDialog(true);
  };

  const confirmDeleteDeal = () => {
    deleteDeal({
      variables: {
        dealId: itemToDelete,
      },
    })
      .then((response) => {
        if (response.data.deleteDeal.success) {
          dispatch(removeDeal(itemToDelete));
          setAlertMessage("Deal deleted successfully!");
          setAlertType("success");
        } else {
          setAlertMessage("Failed to delete the deal.");
          setAlertType("error");
        }
        setShowAlertDialog(true);
      })
      .catch((error) => {
        console.error("Error deleting deal:", error);
        setAlertMessage("An error occurred while deleting the deal.");
        setAlertType("error");
        setShowAlertDialog(true);
      });
    setShowDeleteDealDialog(false);
  };

  const visibleColumns = role === "admin" && userId == null ? 11 : 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "VERIFIED":
        return "bg-green-500";
      case "DENIED":
        return "bg-red-500";
    }
  };

  return (
    <div>
      <div className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-blue border border-gray-200 rounded-md">
            <TableHeader>
              <TableRow className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  Deal ID
                </TableHead>
                {role === "admin" && userId == null ? (
                  <TableHead className="py-3 px-4 md:px-6 text-left">
                    User
                  </TableHead>
                ) : null}
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  DEAL NAME
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  CLIENT NAME
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  DEAL DATE
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  DUE DATE
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  PAYMENTS
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  DEAL VALUE
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  Dues Amount
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-left">
                  Remarks
                </TableHead>
                <TableHead className="py-3 px-4 md:px-6 text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-700 text-sm font-light">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal, index) => (
                  <React.Fragment key={deal.id}>
                    <TableRow className="border-b border-gray-200 hover:bg-gray-50 relative">
                      <TableCell
                        className="py-3 px-4 md:px-6 text-left font-semibold"
                        style={{
                          maxWidth: "5cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {deal?.dealId}
                      </TableCell>
                      {role === "admin" && userId == null ? (
                        <TableCell className="py-3 px-4 md:px-6 text-left font-semibold">
                          {deal?.user.fullName}
                        </TableCell>
                      ) : null}
                      <TableCell
                        className="py-3 px-4 md:px-6 text-left font-semibold"
                        style={{
                          maxWidth: "5cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {deal?.dealName}
                      </TableCell>
                      <TableCell
                        className="py-3 px-4 md:px-6 text-left "
                        style={{
                          maxWidth: "5cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {deal?.client?.fullName}
                      </TableCell>
                      <TableCell className="py-3 px-4 md:px-6 text-left ">
                        {format(new Date(deal.dealDate), "EEEE, MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-3 px-4 md:px-6 text-left ">
                        {format(new Date(deal.dueDate), "EEEE, MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-3 px-4 md:px-6 flex gap-x-2 md:gap-x-[2rem] text-left  h-full">
                        <div className="flex flex-wrap gap-x-2 gap-y-2">
                          {deal?.payments?.map((payment, paymentIndex) => {
                            let icon;
                            switch (payment.paymentStatus) {
                              case "VERIFIED":
                                icon = (
                                  <span className="text-green-500 mr-2">
                                    ✔️
                                  </span>
                                );
                                break;
                              case "PENDING":
                                icon = (
                                  <span className="text-yellow-500 mr-2">
                                    🟡
                                  </span>
                                );
                                break;
                              case "DENIED":
                                icon = (
                                  <span className="text-red-500 mr-2">🔴</span>
                                );
                                break;
                              default:
                                icon = null;
                            }
                            return (
                              <div
                                key={paymentIndex}
                                className="flex items-center gap-x-2 w-full md:w-auto"
                              >
                                <span className="font-medium">
                                  {icon}
                                  {`$${payment.receivedAmount.toLocaleString()}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>

                      <TableCell
                        className="py-3 px-4 md:px-6 text-left font-medium"
                        style={{
                          maxWidth: "4cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        ${deal?.dealValue}
                      </TableCell>
                      <TableCell
                        className="py-3 px-4 md:px-6 text-left font-medium"
                        style={{
                          maxWidth: "4cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        ${deal?.duesAmount}
                      </TableCell>
                      <TableCell
                        className="py-3 px-4 md:px-6 text-left "
                        style={{
                          maxWidth: "5cm",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {deal?.remarks}
                      </TableCell>

                      <TableCell className="py-3 px-4 md:px-6 ">
                        <div className="flex justify-end items-center space-x-1">
                          {role === "admin" && userId == null ? (
                            <div className="flex items-center space-x-4">
                              {deal.payments && deal?.payments.length <= 0 ? (
                                <Button
                                  onClick={() => deleteDealWithID(deal.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4 text-red-700 hover:text-gray-700" />
                                </Button>
                              ) : null}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-4">
                              <AddPayment dealId={deal.id} />
                              <Button
                                onClick={() => handleEditDeal(deal.id)}
                                className="h-8 w-8 p-0"
                                variant="ghost"
                                size="sm"
                              >
                                <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                              </Button>
                            </div>
                          )}
                          <Button
                            className="h-8 w-8 p-0"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === index ? null : index
                              )
                            }
                          >
                            <ChevronsUpDown className="text-gray-500 cursor-pointer h-4 w-4" />
                          </Button>
                        </div>

                        {/* Edited Tag */}
                        <div className="text-right">
                          {deal.isEdited && (
                            <span className="text-xs text-gray-500">
                              (edited)
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedRow === index && (
                      <TableRow className="bg-orange-50">
                        <TableCell
                          colSpan={visibleColumns}
                          className="py-4 px-6 bg-gray-100"
                        >
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow className="bg-blue-200">
                                <TableHead>Payment</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Payment Created</TableHead>
                                <TableHead>Payment Value</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Receipt Link</TableHead>
                                <TableHead>Verified By</TableHead>
                                <TableHead>Payment Remarks</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {deal.payments?.map((payment, idx) => (
                                <TableRow key={idx} className="border-b">
                                  <TableCell>{idx + 1}</TableCell>
                                  <TableCell>
                                    {format(
                                      new Date(payment.paymentDate),
                                      "EEEE, MMMM dd, yyyy"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {format(
                                      new Date(payment.createdAt),
                                      "EEEE, MMMM dd, yyyy"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    ${payment.receivedAmount}
                                  </TableCell>
                                  <TableCell
                                    className={`${getStatusColor(
                                      payment.paymentStatus
                                    )}`}
                                  >
                                    {payment.paymentStatus}
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      href={`${ServerURL}/${payment.receiptImage}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      View
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    {payment.verifier
                                      ? payment.verifier.fullName
                                      : " "}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      width: "5cm",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {payment.remarks || "N/A"}
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      {role == "admin" ? (
                                        <Button
                                          onClick={() =>
                                            handleDeletePayment(payment.id)
                                          }
                                          className="h-8 w-8 p-0"
                                          variant="ghost"
                                          size="sm"
                                        >
                                          <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() =>
                                            handleEditPayment(payment)
                                          }
                                          className="h-8 w-8 p-0"
                                          variant="ghost"
                                          size="sm"
                                        >
                                          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                        </Button>
                                      )}
                                      {payment.isEdited && (
                                        <span className="text-xs text-gray-500">
                                          (edited)
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, totalDeals)}
                  </span>{" "}
                  of <span className="font-medium">{totalDeals}</span> results
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setCurrentPage(1)}
                      variant={currentPage === 1 ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        currentPage === 1
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      1
                    </Button>

                    {currentPage > 3 && <span className="px-2">...</span>}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map(
                        (page) =>
                          page !== 1 &&
                          page !== totalPages && (
                            <Button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              variant={
                                currentPage === page ? "default" : "ghost"
                              }
                              size="sm"
                              className={`h-8 w-8 p-0 ${
                                currentPage === page
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </Button>
                          )
                      )}

                    {currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalPages > 1 && (
                      <Button
                        onClick={() => setCurrentPage(totalPages)}
                        variant={
                          currentPage === totalPages ? "default" : "ghost"
                        }
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={showDeletePaymentDialog}
        onOpenChange={setShowDeletePaymentDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePayment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Payment Modal */}
      <Dialog
        open={showEditPaymentModal}
        onOpenChange={setShowEditPaymentModal}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <EditPayment
              paymentData={selectedPayment}
              onClose={() => setShowEditPaymentModal(false)}
              onSuccess={() => {
                setShowEditPaymentModal(false);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Existing Delete Deal Alert Dialog */}
      <AlertDialog
        open={showDeleteDealDialog}
        onOpenChange={setShowDeleteDealDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              deal and all associated payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeal}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditDeal && (
        <EditDeal
          showEditDeal={showEditDeal}
          setShowEditDeal={setShowEditDeal}
          selectedDealData={selectedDeal}
        />
      )}
    </div>
  );
};

export default DealTable;
