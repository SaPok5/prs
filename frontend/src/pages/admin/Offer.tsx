import { Button } from "@/components/ui/button";
import {
  ASSIGN_OFFER_TO_TEAM,
  CREATE_OFFER,
} from "@/graphql/mutation/offer.mutation";
import {
  GET_OFFERS,
  OFFER_TARGET_MEET,
  UPDATE_OFFER,
} from "@/graphql/query/offer.query";
import { GET_ALL_TEAMS } from "@/graphql/query/teams.query";
import AddOfferModal from "@/models/AddOfferModel";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ChevronsUpDown, PlusCircle, Search, Pencil, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import EditOfferModal from "@/models/EditOffer";

// Define TypeScript interfaces for better type safety
interface Offer {
  id: string;
  target: number;
  bonus: number;
  offer: number;
  remarks: string;
  OfferAssign?: Array<{
    team?: {
      id: string;
      teamName: string;
    };
  }>;
}

interface OfferForm {
  target: string;
  bonus: string;
  offer: string;
  remarks: string;
  selectedMonthData: {
    month: number;
    year: number;
  };
}

const Offer = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");
  const [offer, setOffer] = useState<OfferForm>({
    target: "",
    bonus: "",
    offer: "",
    remarks: "",
    selectedMonthData: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    data: fetchOffers,
    loading: loadingOffer,
    refetch,
  } = useQuery(GET_OFFERS);
  const [createOffer] = useMutation(CREATE_OFFER);
  const [fetchTeams, { data: teamData }] = useLazyQuery(GET_ALL_TEAMS);
  const [assignOfferToTeam] = useMutation(ASSIGN_OFFER_TO_TEAM);
  const [fetchTargetSales, { data: salesData }] =
    useLazyQuery(OFFER_TARGET_MEET);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [updateOffer] = useMutation(UPDATE_OFFER);
  // const { data: fetchOffers, loading: loadingOffer, refetch } = useQuery(GET_OFFERS);

  useEffect(() => {
    if (fetchOffers?.getOffers) {
      setOffers(fetchOffers.getOffers);
    }
  }, [fetchOffers]);

  const handleSearch = () => {
    if (!fetchOffers?.getOffers) return;

    const filteredOffers = fetchOffers.getOffers.filter((offer: Offer) =>
      offer.offer.toString().toLowerCase().includes(search.toLowerCase())
    );
    setOffers(filteredOffers);
  };

  const handleAddOffer = async (values: OfferForm) => {
    try {
      const { data } = await createOffer({
        variables: {
          input: {
            target: parseFloat(values.target),
            bonus: parseFloat(values.bonus),
            offer: parseFloat(values.offer),
            remarks: values.remarks,
            offerDate: new Date(
              values.selectedMonthData.year,
              values.selectedMonthData.month - 1
            ).toISOString(),
          },
        },
      });

      if (data?.createOffer?.data) {
        setOffers((prevOffers) => [...prevOffers, data.createOffer.data]);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding offer:", error);
      // Add proper error handling here
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditOffer(offer);
    setIsEditModalOpen(true);
  };

  const handleUpdateOffer = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    if (!editOffer) {
      return { success: false, message: "No offer selected for update." };
    }

    try {
      const { data, errors } = await updateOffer({
        variables: {
          input: {
            id: editOffer.id,
            target: editOffer.target.toString(),
            bonus: editOffer.bonus.toString(),
            offer: editOffer.offer.toString(),
            remarks: editOffer.remarks,
          },
        },
      });

      // Extremely verbose logging
      console.group("Update Offer Detailed Logging");
      console.log("Raw Data:", data);
      console.log("Errors:", errors);
      console.log("EditOffer Data:", data?.editOffer);
      console.log("Status:", data?.editOffer?.status);
      console.groupEnd();

      // Explicit checks with more detailed logging
      if (data?.editOffer?.status?.success) {
        await refetch(); // Refresh data after successful update
        console.log("Success Condition Met");
        return {
          success: true,
          message:
            data.editOffer.status.message || "Offer Updated Successfully",
        };
      }

      console.log("Failed to meet success condition");
      return {
        success: false,
        message: data?.editOffer?.status?.message || "Failed to update offer",
      };
    } catch (error) {
      console.error("Update Offer Error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  const resetForm = () => {
    setOffer({
      target: "",
      bonus: "",
      offer: "",
      remarks: "",
      selectedMonthData: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    });
    setIsAddModalOpen(false);
  };

  const handleAssignOffer = async () => {
    if (!selectedOffer?.id || !selectedTeam) return;

    try {
      const { data } = await assignOfferToTeam({
        variables: {
          teamId: selectedTeam,
          offerId: selectedOffer.id,
        },
      });

      if (data?.assignOfferToTeam?.success) {
        updateOffersAfterAssignment();
        resetAssignmentForm();
      }
    } catch (error) {
      console.error("Error assigning offer to team:", error);
      // Add proper error handling here
    }
  };

  const updateOffersAfterAssignment = () => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === selectedOffer?.id
          ? {
              ...offer,
              OfferAssign: [
                {
                  team: {
                    id: selectedTeam,
                    teamName: teamData?.allTeams.find(
                      (team: any) => team.id === selectedTeam
                    )?.teamName,
                  },
                },
              ],
            }
          : offer
      )
    );
  };

  const resetAssignmentForm = () => {
    setIsAssignModalOpen(false);
    setSelectedTeam("");
    setSelectedOffer(null);
  };

  const handleExpandRow = (index: number, offerId: string) => {
    setExpandedRow(expandedRow === index ? null : index);
    if (expandedRow !== index) {
      fetchTargetSales({
        variables: {
          offerId,
        },
      });
    }
  };

  if (loadingOffer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Search and Add Offer */}
      <div className="flex justify-between items-center mb-8 mx-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search Offer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearch}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="outline"
          className="flex items-center"
        >
          <PlusCircle className="h-5 w-5" />
          Add Offer
        </Button>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  S.N.
                </th>
                <th className="w-[20%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Target
                </th>
                <th className="w-[20%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Offer
                </th>
                <th className="w-[20%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Bonus
                </th>
                <th className="w-[20%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Remarks
                </th>
                <th className="w-[15%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Team
                </th>
                <th className="w-[15%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.map((offer, index) => (
                <React.Fragment key={offer.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">
                      {index + 1}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-900 font-medium truncate">
                      {offer.target}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">
                      {offer.offer}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate hidden md:table-cell">
                      {offer.bonus}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate hidden md:table-cell">
                      {offer.remarks}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">
                      {offer?.OfferAssign?.[0]?.team?.teamName ||
                        "Not Assigned"}
                    </td>
                    <td className="px-8 py-5 text-sm flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOffer(offer);
                          setIsAssignModalOpen(true);
                          fetchTeams();
                        }}
                      >
                        Assign Offer
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <button
                        onClick={() => handleExpandRow(index, offer.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <ChevronsUpDown className="h-5 w-5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr>
                      <td colSpan={7}>
                        <div className="bg-gray-100 px-8 py-4">
                          <h4 className="font-medium mb-2">Sales Details</h4>
                          <p>
                            Total Sales:{" "}
                            {salesData?.getOfferMeetTargetByTeam?.totalSales ||
                              "0"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Offer Modal */}
      {isAddModalOpen && (
        <AddOfferModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          offer={offer}
          setOffer={setOffer}
          handleAddOffer={handleAddOffer}
          setIsPickerOpen={setIsPickerOpen}
          isPickerOpen={isPickerOpen}
        />
      )}

      {/* Assign Offer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Offer</h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="focus:outline-none"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {isEditModalOpen && editOffer && (
              <EditOfferModal
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                offer={editOffer}
                handleUpdateOffer={handleUpdateOffer}
                setEditOffer={setEditOffer}
              />
            )}
            <div className="space-y-4">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="" disabled>
                  Select Team
                </option>
                {teamData?.allTeams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignOffer} className=" bg-blue-600">
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Offer Modal */}
      {isEditModalOpen && editOffer && (
        <EditOfferModal
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          offer={editOffer}
          handleUpdateOffer={handleUpdateOffer}
          setEditOffer={setEditOffer}
        />
      )}
    </div>
  );
};

export default Offer;
