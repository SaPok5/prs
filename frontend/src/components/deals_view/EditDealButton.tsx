import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_DEAL } from "@/graphql/mutations";
import { GET_USER_CLIENT_DROPDOWN } from "@/graphql/query/client.query";
import { GET_WORKTYPES } from "@/graphql/query/work-type.query";
import { GET_SOURCE_TYPE } from "@/graphql/query/source-type.query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { updateDeal } from "@/redux/deal/dealSlice";

interface DealDetailsProps {
  selectedDealData: any;
  showEditDeal: any;
  setShowEditDeal: any;
}

const EditDeal: React.FC<DealDetailsProps> = ({
  selectedDealData,
  showEditDeal,
  setShowEditDeal,
}) => {
  const dispatch = useDispatch();

  const formattedDealData = {
    id: selectedDealData.id,
    dealId: selectedDealData.dealId || "",
    dealName: selectedDealData.dealName || "",
    clientName: selectedDealData.client.fullName || "",
    clientId: selectedDealData.clientId || "",
    workType: selectedDealData.workType.id || "",
    sourceType: selectedDealData.sourceType.id || "",
    dealValue: selectedDealData.dealValue?.toString() || "0",
    startDate: selectedDealData.dealDate || "",
    endDate: selectedDealData.dueDate || "",
    remarks: selectedDealData.remarks || "",
  };
  const [dealData, setDealData] = useState(formattedDealData);

  const [editDeal, { loading: mutationLoading }] = useMutation(EDIT_DEAL);

  const { data: clientsData} =
    useQuery(GET_USER_CLIENT_DROPDOWN);
  const { data: workTypeData  } =
    useQuery(GET_WORKTYPES);
  const { data: sourceTypeData } =
    useQuery(GET_SOURCE_TYPE);
  // const { loading, error, data } = useQuery(GET_DEAL_DETAILS, {
  //   variables: { dealId },
  // });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setDealData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedDealData = {
      id: dealData.id,
      dealName: dealData.dealName,
      dealValue: parseFloat(dealData.dealValue) || 0,
      sourceType: dealData.sourceType,
      workType: dealData.workType,
      remarks: dealData.remarks,
      dealDate: dealData.startDate,
      dueDate: dealData.endDate,
      clientId: dealData.clientId,
    };

    try {
      const response = await editDeal({
        variables: {
          input: updatedDealData,
        },
      });

      if (response.data.editDeal.status.success) {
        // Dispatch the updated deal to Redux store

        const updatedDealWithoutPayments = {
          ...response.data.editDeal.data,
          payments: null,
        };
        dispatch(updateDeal(updatedDealWithoutPayments));
        setDialogOpen(true);
      } else {
        alert(`Failed to edit deal: ${response.data.editDeal.status.message}`);
      }
    } catch (err) {
      console.error("Error editing deal:", err);
      alert("Error occurred while editing the deal.");
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(dealData);

  return (
    <>
      <Dialog open={showEditDeal} onOpenChange={setShowEditDeal}>
        {/* <DialogTrigger asChild>
          <Button className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 font-semibold bg-white text-black border border-gray-300">
           
          </Button>
        </DialogTrigger> */}

        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same */}
            {/* S.No. and Deal Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="dealId" className="text-sm font-medium">
                  S.No.
                </label>
                <input
                  type="text"
                  name="dealId"
                  id="dealId"
                  value={dealData.dealId}
                  className="w-full h-10 border p-2 rounded-md"
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="dealName" className="text-sm font-medium">
                  Deal Name
                </label>
                <input
                  type="text"
                  name="dealName"
                  id="dealName"
                  value={dealData.dealName}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                  placeholder="Enter Deal Name"
                />
              </div>
            </div>

            {/* Client and Work Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="clientId" className="text-sm font-medium">
                  Client Name
                </label>
                <select
                  name="clientId"
                  value={dealData.clientId}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                >
                  <option value="">Select Client</option>
                  {clientsData?.getUserClient?.map((client: any) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </select>
                {dealData.clientId == "" && (
                  <p className="text-red-500 text-sm mt-1">Select Client</p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="workType" className="text-sm font-medium">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={dealData.workType}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                >
                  <option value="">Select Work Type</option>
                  {workTypeData?.workTypes?.data.map((workType: any) => (
                    <option key={workType.id} value={workType.id}>
                      {workType.name}
                    </option>
                  ))}
                </select>
                {dealData.workType == "" && (
                  <p className="text-red-500 text-sm mt-1">Select work type</p>
                )}
              </div>
            </div>

            {/* Source Type and Deal Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="sourceType" className="text-sm font-medium">
                  Source Type
                </label>
                <select
                  name="sourceType"
                  value={dealData.sourceType}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                >
                  <option value="">Select Source Type</option>
                  {sourceTypeData?.sourceTypes.data.map((sourceType: any) => (
                    <option key={sourceType.id} value={sourceType.id}>
                      {sourceType.name}
                    </option>
                  ))}
                </select>
                {dealData.sourceType == "" && (
                  <p className="text-red-500 text-sm mt-1">Select Source Type</p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="dealValue" className="text-sm font-medium">
                  Deal Value
                </label>
                <input
                  type="text"
                  name="dealValue"
                  id="dealValue"
                  value={dealData.dealValue}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                  placeholder="Enter Deal Value"
                />
              </div>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={dealData.startDate}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={dealData.endDate}
                  onChange={handleInputChange}
                  className="w-full h-10 border p-2 rounded-md"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col">
              <label htmlFor="remarks" className="text-sm font-medium">
                Remarks
              </label>
              <textarea
                name="remarks"
                id="remarks"
                value={dealData.remarks}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-md"
                rows={4}
                placeholder="Enter any remarks..."
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600"
                disabled={mutationLoading}
              >
                {mutationLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deal Edited Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              The deal has been updated successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditDeal;
