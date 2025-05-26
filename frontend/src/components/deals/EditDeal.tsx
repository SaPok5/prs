import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useMutation, useQuery } from '@apollo/client';
import { GET_DEAL_DETAILS } from '@/graphql/queries';
import { EDIT_DEAL } from '@/graphql/mutations';
import { DealDate } from '../date/DealDate';
import { DueDate } from '../date/DueDate';

interface DealDetailsProps {
    dealId: string;
}

const EditDeals: React.FC<DealDetailsProps> = ({ dealId }) => {
    const [open, setOpen] = useState(false);
    const [dealData, setDealData] = useState({
        serialNo: '',
        dealName: '',
        clientName: '',
        workType: '',
        sourceType: '',
        dealValue: '',
        startDate: null,
        endDate: null,
        remarks: '',
    });

    const [editDeal, { loading: mutationLoading }] = useMutation(EDIT_DEAL);
    const [showAlert, setShowAlert] = useState({ type: '', message: '' });

    const { loading, error, data, refetch } = useQuery(GET_DEAL_DETAILS, {
        variables: { dealId },
    });

    useEffect(() => {
        if (data && data.getDealDetailsById) {
            const dealDetail = data.getDealDetailsById.dealsDetail;
            setDealData({
                serialNo: dealDetail.dealId || '',
                dealName: dealDetail.dealName || '',
                clientName: dealDetail.client.fullName || '',
                workType: dealDetail.workType || '',
                sourceType: dealDetail.sourceType || '',
                dealValue: dealDetail.dealValue.toString() || '',
                startDate: dealDetail.dealDate || null,
                endDate: dealDetail.dueDate || null,
                remarks: dealDetail.remarks || '',
            });
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDealData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAlertClose = () => {
        setShowAlert({ type: '', message: '' });
        setOpen(false);
        refetch();
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dealId) {
            setShowAlert({ type: 'error', message: "Deal ID is missing." });
            return;
        }
    
        const variables = {
            input: {
                id: dealId,
                dealName: dealData.dealName,
                dealValue: parseFloat(dealData.dealValue),
                sourceType: dealData.sourceType,
                workType: dealData.workType,
                remarks: dealData.remarks,
                dealDate: dealData.startDate,
                dueDate: dealData.endDate,
            },
        };
    
        try {
            const response = await editDeal({
                variables,
                refetchQueries: ['GetDealDetails'],
                awaitRefetchQueries: true,
            });
    
            if (response.data.editDeal.status.success) {
                setShowAlert({ type: 'success', message: 'Deal edited successfully!' });
                
             
                setOpen(false);
                
                
                setTimeout(() => {
                    handleAlertClose();
                }, 2000);
                
                await refetch();
            } else {
                setShowAlert({ type: 'error', message: response.data.editDeal.status.message });
            }
        } catch (err) {
            setShowAlert({ type: 'error', message: 'Error occurred while editing the deal.' });
            console.error("Error:", err);
        }
    };
    
    
    
    
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error fetching deal details: {error.message}</p>;

      return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Pencil className="text-gray cursor-pointer" onClick={() => setOpen(true)} />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Deal</DialogTitle>
            </DialogHeader>
            <hr className="my-4 border-gray-300" />
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* S.No. and Deal Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="serialNo" className="text-sm font-medium">S.No.</label>
                            <input
                                type="text"
                                name="serialNo"
                                id="serialNo"
                                value={dealData.serialNo}
                                onChange={handleInputChange}
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="M-5327"
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="dealName" className="text-sm font-medium">Deal Name</label>
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

                    {/* Client Name and Work Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="clientName" className="text-sm font-medium">Client's Name</label>
                            <input
                                name="clientName"
                                id="clientName"
                                value={dealData.clientName}
                                onChange={handleInputChange}
                                className="w-full h-10 p-2 pr-12 border rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="workType" className="text-sm font-medium">Work Type</label>
                            <input
                                name="workType"
                                id="workType"
                                value={dealData.workType}
                                onChange={handleInputChange}
                                className="w-full h-10 p-2 pr-12 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Source Type and Deal Value */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="sourceType" className="text-sm font-medium">Source Type</label>
                            <input
                                name="sourceType"
                                id="sourceType"
                                value={dealData.sourceType}
                                onChange={handleInputChange}
                                className="w-full h-10 p-2 pr-12 border rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="dealValue" className="text-sm font-medium">Deal Value</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="dealValue"
                                    id="dealValue"
                                    value={dealData.dealValue}
                                    onChange={handleInputChange}
                                    className="w-full h-10 border p-2 pr-12 rounded-md"
                                    placeholder="Enter Deal Value"
                                />
                                <p className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-600">A U D</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="text-sm font-medium">Deal Date</label>
                            <DealDate />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="text-sm font-medium">Due Date</label>
                            <DueDate />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="remarks" className="text-sm font-medium">Remarks</label>
                        <input
                            name="remarks"
                            id="remarks"
                            value={dealData.remarks}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 pr-12 rounded-md"
                            placeholder="Enter remarks here"
                        />
                    </div>

                    <DialogFooter>
                    <Button
                        variant="outline"
                        className="flex items-center px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        type="button"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        type="submit"
                        disabled={mutationLoading}
                    >
                        {mutationLoading ? 'Saving...' : 'Save'}
                    </Button>

                    {/* Success Alert */}
                    <AlertDialog open={showAlert.type === 'success'} onOpenChange={handleAlertClose}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Success</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {showAlert.message}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleAlertClose}>
                                    OK
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Error Alert */}
                    <AlertDialog open={showAlert.type === 'error'} onOpenChange={handleAlertClose}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Error</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {showAlert.message}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleAlertClose}>
                                    OK
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);
};

export default EditDeals;