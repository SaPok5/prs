// import AddFirstPayment from "./AddFristPayment";
import { useQuery } from "@apollo/client";
import { GET_DEAL_DETAILS } from "@/graphql/queries";
import AddPayment from "../deals/AddPayment";

// Define the Payment interface based on the GraphQL response structure
interface Payment {
  id: string;
  paymentDate: string;
  receivedAmount: number;
  receiptImage: string;
  paymentStatus: string;
  createdAt: string;
  verifiedBy?: string; 
  remarks?: string;
  verificationRemarks?: string;
}

interface DealPaymentProps {
  dealId: string; 
}

const FirstPaymentDetails: React.FC<DealPaymentProps> = ({ dealId }) => {
  const { loading, error, data } = useQuery(GET_DEAL_DETAILS, {
    variables: { dealId },
  });

  if (loading) return <p>Loading deal details...</p>;
  if (error) return <p>Error fetching deal details: {error.message}</p>;

  const deal = data.getDealDetailsById.dealsDetail;
  const payments: Payment[] = deal.payments; // Specify the type here

  return (
    <div>
      <div className="flex-col items-center justify-between">
        {payments.length > 0 ? (
          payments.map((payment: Payment) => ( // Specify the type for payment
            <div key={payment.id} className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">
                  {payment.remarks || "No Remarks"}
                </p>
                <AddPayment dealId={dealId} />
              </div>

              <div className="bg-white-800 p-8 rounded shadow-md w-full mx-auto">
                <div className="grid grid-cols-2 gap-8">
             
                  <div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment :</span>
                      <span className="text-gray-800 font-semibold">First</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment Date :</span>
                      <span className="text-gray-800 font-semibold">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment Created :</span>
                      <span className="text-gray-800 font-semibold">{new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment Value :</span>
                      <span className="text-gray-800 font-semibold">{payment.receivedAmount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment Version :</span>
                      <span className="text-gray-800 font-semibold">Original</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Payment Status :</span>
                      <span className="text-gray-800 font-semibold">{payment.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Receipt Link:</span>
                      <span className="text-blue-800 font-semibold">{payment.receiptImage}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Verified By :</span>
                      <span className="text-gray-800 font-semibold">{payment.verifiedBy || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 font-medium">Remarks :</span>
                      <span className="text-gray-800 font-semibold">{payment.remarks || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className=" text-gray-600 font-medium">Verification Remarks :</span>
                      <span className="text-gray-800 font-semibold">{payment.verificationRemarks || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Payments Available</p>
        )}
      </div>
    </div>
  );
};

export default FirstPaymentDetails;