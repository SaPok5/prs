import { useQuery } from "@apollo/client";
import { GET_DEAL_DETAILS } from "@/graphql/queries";

interface DealDetailsProps {
  dealId: string;
}

const DealDetails: React.FC<DealDetailsProps> = ({ dealId }) => {
  const { loading, error, data } = useQuery(GET_DEAL_DETAILS, {
    variables: { dealId }, 
  });

  // Handle loading and error states
  if (loading) return <p>Loading deal details...</p>;
  if (error) return <p>Error fetching deal details: {error.message}</p>;

  // Destructure the deal data from the response
  const deal = data.getDealDetailsById.dealsDetail;

  return (
    <div className="bg-white-800 p-8 rounded rounded-[15px] shadow-md w-full mx-auto">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">S. No. :</span>
            <span className="text-gray-800 font-semibold">{deal.dealId}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Client Name :</span>
            <span className="text-gray-800 font-semibold">{deal.client.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Source Type :</span>
            <span className="text-gray-800 font-semibold">{deal.sourceType}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Deal Created Date :</span>
            <span className="text-gray-800 font-semibold">{new Date(deal.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Deal Version :</span>
            <span className="text-gray-800 font-semibold">Original</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Payment :</span>
            <span className="text-gray-800 font-semibold">{deal.payments.length > 0 ? "First" : "None"}</span>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Deal Name :</span>
            <span className="text-gray-800 font-semibold">{deal.dealName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Work Type :</span>
            <span className="text-gray-800 font-semibold">{deal.workType}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Deal Date :</span>
            <span className="text-gray-800 font-semibold">{new Date(deal.dealDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Due Date :</span>
            <span className="text-gray-800 font-semibold">{new Date(deal.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Due Value :</span>
            <span className="text-gray-800 font-semibold">{deal.dealValue}</span>
          </div>
          <div className ="flex justify-between py-2 border-b">
            <span className="text-gray-600 font-medium">Description :</span>
            <span className="text-gray-800 font-semibold">{deal.remarks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;