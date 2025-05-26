import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FilterPaymentsByDateRange } from "@/graphql/queries";
import PaymentAllButton, { DateRangeFilter } from "./PaymentAllButton";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ServerURL } from "@/constants/ApiUrl";
import { Button } from "../ui/button";

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
  denialRemarks: string;
}

// const extractFileName = (filePath: string) => {
//   const parts = filePath.split("-");
//   const fileNameWithExtension = parts.slice(1).join("-");
//   return fileNameWithExtension.replace(/\.[^/.]+$/, "");
// };

const PaymentPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filter, setFilter] = useState<"PENDING" | "VERIFIED" | "DENIED">(
    "PENDING"
  );
  const [search,setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("All");

  const { loading, error, data } = useQuery(
    FilterPaymentsByDateRange,
    {
      variables: {
        dateRange,
        paymentStatus: filter,
        page: currentPage,
        limit: itemsPerPage,
        searchQuery,
      },
      fetchPolicy: "network-only",
    }
  );

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error fetching payments: {error.message}</p>;

  const tableData: TableRow[] =
    data.filterPaymentsByDateRange.payments.map((payment: any) => ({
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
      denialRemarks: payment?.denialRemarks,
    })) || [];
  const totalPages = data?.filterPaymentsByDateRange.totalPages || 0;
  const totalCount = data?.filterPaymentsByDateRange.totalCount || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  // const filteredData = tableData.filter(
  //   (row) =>
  //     row.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     row.dealName.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleDateRangeChange = (range: DateRangeFilter) => {
    setDateRange(range);
    setCurrentPage(1); // Reset to first page when changing date range
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(search)
  };

  return (
    <div className="p-2 bg-gray-100 h-screen w-[1650px]">
      <div className="flex justify-center items-center">
        <ul className="flex border-b">
          {["PENDING", "VERIFIED", "DENIED"].map((status) => (
            <li
              key={status}
              className={`px-4 py-2 cursor-pointer ${
                filter === status ? "border-b-2 border-red-500 font-bold" : ""
              }`}
              onClick={() =>
                setFilter(status as "PENDING" | "VERIFIED" | "DENIED")
              }
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </li>
          ))}
        </ul>
      </div>
      <hr className="my-0 border-gray-300" />

      <div className="flex justify-between items-center mb-4 mt-4  space-x-4">
        <div className="relative flex-1">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-grow">
              <Search className="absolute top-2.5 left-2.5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="q"
                className="w-full h-10 pl-10 pr-4 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search by Deal Name or Remarks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="h-10 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <PaymentAllButton
          onDateRangeChange={handleDateRangeChange}
          dateRange={dateRange}
        />
      </div>
      <hr className="my-4 border-gray-300" />
      <Table className="min-w-full bg-white border border-gray-200 rounded-md mt-4">
        <TableHeader>
          <TableRow className="bg-white-100 text-white-600 uppercase text-sm leading-normal">
            <TableHead className="py-3 px-6 text-center">Deal ID</TableHead>
            <TableHead className="py-3 px-6 text-center">Deal Name</TableHead>
            <TableHead className="py-3 px-6 text-center">Client Name</TableHead>
            <TableHead className="py-3 px-6 text-center">
              Payment Date
            </TableHead>
            <TableHead className="py-3 px-6 text-center">
              Received Amount
            </TableHead>
            <TableHead className="py-3 px-6 text-center">
              Receipt Image
            </TableHead>
            <TableHead className="py-3 px-6 text-center">Remarks</TableHead>
            <TableHead className="py-3 px-6 text-center">
              Payment Status
            </TableHead>
            {filter == "DENIED" ? (
              <TableHead className="py-3 px-6 text-center">
                Denial Remarks
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          { tableData.length > 0 ? (
            tableData.map((row, index) => (
              <TableRow
                key={index}
                className="text-sm leading-normal bg-orange-100"
              >
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {row.dealId}
                </TableCell>
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {row.dealName}
                </TableCell>
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {row.clientName}
                </TableCell>
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {format(new Date(row.paymentDate), "EEEE, MMMM dd, yyyy")}
                </TableCell>
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {row.receivedAmount}
                </TableCell>
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
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
                <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                  {row.paymentStatus}
                </TableCell>
                {filter == "DENIED" ? (
                  <TableCell className="py-3 px-6 max-w-[4cm] break-words text-center">
                    {row.denialRemarks}
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ): (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <span className="text-sm">No results found</span>
                  <span className="text-xs mt-1">
                    Try adjusting your search criteria
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(endIndex, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
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
                          variant={currentPage === page ? "default" : "ghost"}
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
                    variant={currentPage === totalPages ? "default" : "ghost"}
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
  );
};

export default PaymentPage;
