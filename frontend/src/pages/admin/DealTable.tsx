import { useEffect, useState } from "react";
import { ChevronsUpDown,Delete,Eye,Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@apollo/client";
import { GET_USERS_DEALS } from "@/graphql/queries";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";


interface Payment {
  id(id: any): void;
  createdAt: string;
  paymentDate: string;
  paymentCreated: string;
  receivedAmount: string;
  paymentVersion: number;
  paymentStatus: string;
  receiptImage: string;
  verifiedBy: string;
  remarks: string;
  verifier: Verifier | null
  verifierId: string | null

}

interface Client {
  fullName: string;
}

interface Verifier{
  fullName: string;
}

interface Deal {
  id: string;
  dealId: string;
  dealName: string;
  clientId: string;
  dealDate: string;
  dueDate: string;
  remarks: string;
  dealValue: number;
  payments: Payment[];
  client: Client;
}

const DealTable = ({filter}:{filter:string}) => {
  const [] = useState<number | null>(null);
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const userId = useSelector(selectUserId)

  // Query for fetching deals with the provided filter
  const { loading, error, data, refetch } = useQuery(GET_USERS_DEALS, {
    variables: { userId, filter },
    fetchPolicy: 'network-only',
  });

  // Effect to refetch data whenever the filter changes
  useEffect(() => {
    if (userId && filter) {
      refetch();
    }
  }, [filter, userId, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching deals: {error.message}</p>;

  const deals: Deal[] = data.dealsOfUser.deals;

  function handleDeletePayment(_id: any): void {
    throw new Error("Function not implemented.");
  }
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  console.log(selectedDealId,"image");

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white border border-gray-200 rounded-md">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <TableHead className="py-3 px-6 text-left">S.NO</TableHead>
            <TableHead className="py-3 px-6 text-left">DEAL NAME</TableHead>
            <TableHead className="py-3 px-6 text-left">CLIENT NAME</TableHead>
            <TableHead className="py-3 px-6 text-left">DEAL DATE</TableHead>
            <TableHead className="py-3 px-6 text-left">DUE DATE</TableHead>
            <TableHead className="py-3 px-6 text-left">PAYMENTS</TableHead>
            <TableHead className="py-3 px-6 text-left">DEAL VALUE</TableHead>
            <TableHead className="py-3 px-6 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-700 text-sm font-light">
          {deals.length > 0 ? (
            deals.map((deal, index) => (
              <>
                <TableRow
                  key={deal.id}
                  className="border-b border-gray-200 hover:bg-gray-50 relative"
                >
                  <TableCell className="py-3 px-6 text-left font-semibold">{deal?.dealId}</TableCell>
                  <TableCell className="py-3 px-6 text-left font-semibold">{deal?.dealName}</TableCell>
                  <TableCell className="py-3 px-6 text-left font-semibold">{deal?.client?.fullName}</TableCell>
                  <TableCell className="py-3 px-6 text-left font-semibold">
                    {new Date(deal.dealDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-left font-semibold">
                    {new Date(deal.dueDate).toLocaleDateString()}
                  </TableCell>
                  {/* Display payment statuses */}
                  <TableCell className="py-3 px-6 flex gap-x-[2rem] text-left font-semibold h-full">
                    {deal.payments.map((payment, paymentIndex) => {
                        let icon;
                        switch (payment.paymentStatus) {
                            case 'VERIFIED':
                                icon = <span className="text-blue-500 mr-2">✔️</span>;
                                break;
                            case 'PENDING':
                                icon = <span className="text-blue-500 mr-2">🟡</span>;
                                break;
                            case 'DENIED':
                                icon = <span className="text-blue-500 mr-2">🔴</span>;
                                break;
                            default:
                                icon = null;
                        }
                        return (
                            <div key={paymentIndex} className="flex items-center">
                                {icon}
                                {payment.paymentStatus}
                            </div>
                        );
                    })}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-left font-semibold">${deal?.dealValue}</TableCell>
                  <TableCell className="py-3 px-6 text-center z-10">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => navigate(`/deal-view/${deal.id}`)}
                        className="flex items-center text-left text-sm hover:bg-gray-100 font-semibold"
                      >
                        <Eye className="text-lg mr-2" />
                      </button>
                      <Delete/>
                      <button
                        className="text-gray-500"
                        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                      >
                        <ChevronsUpDown className="ml-2 text-gray-500 cursor-pointer" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRow === index && (
                  <TableRow className="bg-orange-50">
                    <TableCell colSpan={8} className="py-4 px-6">
                      <Table className="min-w-full text-sm">
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
                          {deal.payments.map((payment, idx) => (
                            <TableRow key={idx} className="border-b">
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>${payment.receivedAmount}</TableCell>
                              <TableCell>{payment.paymentStatus}</TableCell>
                              <TableCell>
                                <a
                                onClick={()=>setSelectedDealId(payment.receiptImage)}
                                  // href={payment.receiptImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  View
                                </a>
                              </TableCell>
                              <TableCell>{ payment.verifier ? payment.verifier.fullName : " "}</TableCell>
                              <TableCell>{payment.remarks || "N/A"}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleDeletePayment(payment.id)}
                                  className="text-gray-500 "
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </>
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
    </div>
  );
};

export default DealTable;
