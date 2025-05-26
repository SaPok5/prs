import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS_BY_ID } from "@/graphql/queries";
import ClientBackButton from "./ClientBackButton";

interface ClientDealProps {
  deal: any;
  index: number;
}

const ClientDeal: React.FC<ClientDealProps> = ({ deal, index }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg w-full">
    <div className="border-b pb-4 mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Deal Details {index + 1}
      </h1>
      <p className="text-sm text-gray-500">Comprehensive deal information</p>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-lg text-gray-800">
          <strong>Deal ID:</strong> {deal.dealId}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Deal Name:</strong> {deal.dealName}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Work Type:</strong> {deal.workType.name}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Source Type:</strong> {deal.sourceType.name}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Deal Value:</strong> ${deal.dealValue}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Deal Date:</strong>{" "}
          {new Date(deal.dealDate).toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-800">
          <strong>Due Date:</strong>{" "}
          {new Date(deal.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="col-span-2">
        <p className="text-lg text-gray-800">
          <strong>Remarks:</strong> {deal.remarks}
        </p>
      </div>
    </div>
  </div>
);

function ClientDetails() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_CLIENTS_BY_ID, {
    variables: { clientId: id },
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const client = data.getClientById?.clients[0];

  if (!client) {
    return <p>No client data found.</p>;
  }

  // Determine layout and positioning based on number of deals
  const getDealLayout = (dealCount: number) => {
    switch (true) {
      case dealCount === 1:
        return {
          containerClass:
            "flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6",
          dealClasses: "w-full lg:w-1/2",
        };
      case dealCount === 2:
        return {
          containerClass:
            "flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6",
          dealClasses: "w-full lg:w-1/2",
        };
      case dealCount === 3:
        return {
          containerClass:
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          dealClasses: "w-full",
        };
      default:
        return {
          containerClass:
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          dealClasses: "w-full",
        };
    }
  };

  const { containerClass, dealClasses } = getDealLayout(
    client.deal?.length || 0
  );

  return (
    <div className="container mx-auto p-6">
      <div className="absolute top-4 right-4">
        <ClientBackButton />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Client Details Section */}
        <div
          className="bg-gradient-to-br from-blue-50 to-blue-100 
                               p-8 rounded-xl shadow-lg 
                               w-full 
                               border-2 border-blue-200"
        >
          <div className="border-b border-blue-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Client Details</h1>
            <p className="text-sm text-blue-600">
              Comprehensive client information
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-blue-900">
            <div>
              <p className="text-lg">
                <strong>Client ID:</strong> {client.clientId}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Name:</strong> {client.fullName}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Email:</strong> {client.email}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Phone Number:</strong> {client.contact}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg">
                <strong>Nationality:</strong> {client.nationality}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg">
                <strong>Added On:</strong>{" "}
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Deals Section with Dynamic Layout */}
        {client.deal && client.deal.length > 0 && (
          <div className={containerClass}>
            {client.deal.map((deal: any, index: number) => (
              <div key={deal.id || index} className={dealClasses}>
                <ClientDeal deal={deal} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDetails;
