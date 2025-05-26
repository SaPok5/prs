import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


export function AddFristPayment() {

    // State to handle the form values and file
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
        paymentDate: null,
        receivedAmount: '',
        additionalRemarks: ''
    });





    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add submission logic here (API call, etc.)
        console.log("Form Submitted: ", dealData);
        // Reset form
        setDealData({
            serialNo: '',
            dealName: '',
            clientName: '',
            workType: '',
            sourceType: '',
            dealValue: '',
            startDate: null,
            endDate: null,
            remarks: '',
            paymentDate: null,
            receivedAmount: '',
            additionalRemarks: ''
        });
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm">
                    <Plus className="mr-2" /> Add Payment
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>

                </DialogHeader>
                <hr className="my-4 border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Payment"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment Date</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment date"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment created</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment created date"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment Value</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment value"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment Version</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment version"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Payment Status</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter payment status"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Receipt Link</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Provide Receipt Link"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Verified By</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter verified by"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Remarks</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter remarks"
                            />
                        </div>
                        <div className="flex items-center w-1/2">
                            <label className="block text-sm font-medium text-gray-600 text-left w-1/3">Verification Remarks</label>
                            <input
                                type="text"
                                className="w-2/3 h-12 border border-gray-300 p-3 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter verification remarks"
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <DialogFooter>
                        <div className="flex justify-center space-x-6 mt-6">
                            <Button className='border border-blue-500 text-blue-500 px-8 py-3 rounded-md w-48 text-sm font-medium' variant="outline" type="button" onClick={() => console.log('Canceled')}>
                                Cancel
                            </Button>
                            <Button className='bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium' type="submit" >
                                Save
                            </Button>
                        </div>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    );
}
