import { useState } from "react";
import { ChevronDown, CheckCircle, XCircle, Clock } from "lucide-react";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import {
  GET_PAYMENT_DETAILS_WITH_STATUS,
} from "../../graphql/queries";

interface Payment {
  id: string;
  paymentDate: string;
  paymentStatus: string;
  receivedAmount: number;
  remarks: string;
  createdAt: string;
  denialRemarks: string;
  deal: {
    dealName: string;
    client: {
      fullName: string;
    };
    dealId: string;
  };
}

interface PaymentData {
  displayPaymentWithStatus: Payment[];
}

function PaymentActivities() {
  const [selectedAction, setSelectedAction] = useState<string>("pending");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { loading, error, data } = useQuery<PaymentData>(
    GET_PAYMENT_DETAILS_WITH_STATUS,
    {
      variables: {
        paymentStatus: selectedAction,
      },
      fetchPolicy:"network-only"
    },
  );

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setShowDropdown(false);
  };

  const filteredPayments =
    data?.displayPaymentWithStatus?.filter((payment) => {
      return (
        payment.paymentStatus.toLowerCase() === selectedAction.toLowerCase()
      );
    }) || [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching payments: {error.message}</p>;

  const statusOptions = [
    {
      label: "Pending",
      value: "pending",
      icon: <Clock className="mr-2 text-yellow-500" />,
      style: "text-yellow-500",
    },
    {
      label: "Verified",
      value: "verified",
      icon: <CheckCircle className="mr-2 text-green-500" />,
      style: "text-green-500",
    },
    {
      label: "Denied",
      value: "denied",
      icon: <XCircle className="mr-2 text-red-500" />,
      style: "text-red-500",
    },
  ];

  const statusStyles: { [key: string]: { color: string; icon: JSX.Element } } =
    {
      pending: {
        color: "bg-yellow-100 border-yellow-500 text-yellow-800",
        icon: <Clock className="text-yellow-500 mr-2" />,
      },
      verified: {
        color: "bg-green-100 border-green-500 text-green-800",
        icon: <CheckCircle className="text-green-500 mr-2" />,
      },
      denied: {
        color: "bg-red-100 border-red-500 text-red-800",
        icon: <XCircle className="text-red-500 mr-2" />,
      },
    };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Activities</h2>
        <div className="relative">
          <button
            className="flex items-center bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 shadow-sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {
              statusOptions.find(
                (option) => option.value === selectedAction
              )?.icon
            }
            {
              statusOptions.find(
                (option) => option.value === selectedAction
              )?.label
            }
            <ChevronDown className="ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded-md shadow-lg">
              <ul className="space-y-2 p-2">
                {statusOptions.map(({ label, value, icon, style }) => (
                  <li key={value}>
                    <button
                      className={`flex items-center px-4 py-2 ${style} hover:bg-gray-200 rounded-md`}
                      onClick={() => handleActionSelect(value)}
                    >
                      {icon}
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {filteredPayments.length > 0 ? (
        filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`p-4 rounded-md shadow-md mb-4 border-l-4 ${statusStyles[payment.paymentStatus]?.color}`}
          >
            <div className="flex items-center mb-2">
              {statusStyles[payment.paymentStatus]?.icon}
              <h3
                className={`text-lg font-semibold ${statusStyles[payment.paymentStatus]?.color}`}
              >
                {payment.remarks}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Amount: <span className="font-bold">${payment.receivedAmount}</span>
            </p>

            {payment?.denialRemarks && (
              <p className="text-sm text-red-600">
                Denied: {payment.denialRemarks}
              </p>
            )}

            {payment?.deal && (
              <p className="text-sm text-blue-600">
                Deal: {payment.deal.dealName}
              </p>
            )}

            <p className="text-sm text-gray-500">
              {format(
                new Date(payment.paymentDate),
                "EEEE, MMMM dd, yyyy hh:mm:ss a"
              )}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          No payments found for {selectedAction} status.
        </p>
      )}
    </div>
  );
}

export default PaymentActivities;
