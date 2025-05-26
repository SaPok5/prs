import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '@/redux/auth/authSlice';
import { BaseApiURL } from '@/constants/ApiUrl';



interface EditPaymentProps {
    paymentData: {
        id: string;
        paymentDate: string;
        receivedAmount: number;
        receiptImage: string;
        remarks: string;
        paymentStatus: string;
        createdAt: string;
        editedAt: string | null;
        verifier?: {
            email: string;
            fullName: string;
            id: string;
            userId: string;
        };
        verifierId?: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

const EditPayment: React.FC<EditPaymentProps> = ({
    paymentData: initialPaymentData,
    onClose,
    onSuccess
}) => {
    const token = useSelector(selectCurrentToken)
    // Convert ISO date to YYYY-MM-DD format for date input
    const formatDate = (isoDate: string) => {
        return isoDate ? new Date(isoDate).toISOString().split('T')[0] : '';
    };

    const [paymentData, setPaymentData] = useState({
        paymentDate: formatDate(initialPaymentData.paymentDate),
        receivedAmount: initialPaymentData.receivedAmount.toString(),
        receiptFile: null as File | null,
        remarks: initialPaymentData.remarks || '',
        paymentStatus: initialPaymentData.paymentStatus,
        receiptImage: initialPaymentData.receiptImage
            ? `/uploads/payment/${initialPaymentData.receiptImage}`
            : '',
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);


    // Handle form field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setPaymentData((prev) => ({
            ...prev,
            receiptFile: file,
            receiptImage: file ? URL.createObjectURL(file) : prev.receiptImage,
        }));
    };

    // Submit form handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('paymentDate', paymentData.paymentDate);
        formData.append('receivedAmount', paymentData.receivedAmount);
        formData.append('remarks', paymentData.remarks);
        formData.append('paymentStatus', paymentData.paymentStatus);
        formData.append('receipt', paymentData.receiptFile as Blob);

        try {
            const response = await fetch(`${BaseApiURL}/payment/edit-payment/${initialPaymentData.id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.status.success) {
                setAlertMessage('Payment edited successfully!');
                setIsSuccess(true);
                setShowAlert(true);
            } else {
                setAlertMessage('Failed to edit payment: ' + data.status.message);
                setIsSuccess(false);
                setShowAlert(true);
            }
            
        } catch (err) {
            alert('Error occurred while editing the payment.');
            console.error(err);
        }
    };

    return (
        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Payment Details</DialogTitle>
            </DialogHeader>
            <hr className="my-4 border-gray-300" />
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Payment Date */}
                <div className="space-y-2">
                    <label htmlFor="paymentDate" className="text-sm font-medium">Payment Date</label>
                    <input
                        type="date"
                        name="paymentDate"
                        id="paymentDate"
                        value={paymentData.paymentDate}
                        onChange={handleInputChange}
                        className="w-full h-10 border p-2 rounded-md"
                    />
                </div>

                {/* Received Amount */}
                <div className="space-y-2">
                    <label htmlFor="receivedAmount" className="text-sm font-medium">Received Amount</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="receivedAmount"
                            id="receivedAmount"
                            value={paymentData.receivedAmount}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 pr-12 rounded-md"
                            placeholder="Enter Received Amount"
                            step="0.01"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">AUD</span>
                    </div>
                </div>

                {/* Receipt File Upload */}
                <div className="space-y-2">
                    <label htmlFor="receiptFile" className="text-sm font-medium">Upload Receipt</label>
                    <input
                        type="file"
                        name="receiptFile"
                        id="receiptFile"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="w-full h-10 border p-2 rounded-md"
                    />
                    {paymentData.receiptFile && (
                        <p className="text-sm text-gray-500 mt-2">
                            Selected File: {paymentData.receiptFile.name}
                        </p>
                    )}
                    {paymentData.receiptImage && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-2">Current Receipt:</p>
                            <img
                                src={paymentData.receiptImage}
                                alt="Receipt"
                                className="w-full h-auto max-h-64 object-contain border rounded-md"
                            />
                        </div>
                    )}
                </div>

                {/* Payment Remarks */}
                <div className="space-y-2">
                    <label htmlFor="remarks" className="text-sm font-medium">Payment Remarks</label>
                    <textarea
                        name="remarks"
                        id="remarks"
                        value={paymentData.remarks}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                        placeholder="Enter any additional remarks"
                        rows={3}
                    />
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                    <label htmlFor="paymentStatus" className="text-sm font-medium">Payment Status</label>
                    <input
                        type="text"
                        name="paymentStatus"
                        id="paymentStatus"
                        value={paymentData.paymentStatus}
                        readOnly
                        className="w-full border p-2 rounded-md bg-gray-100"
                        placeholder="Payment Status"
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="flex items-center px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        type="submit"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </form>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                {isSuccess ? 'Success' : 'Error'}
            </AlertDialogTitle>
            <AlertDialogDescription>
                {alertMessage}
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
                setShowAlert(false);
                if (isSuccess) {
                    onSuccess();
                    onClose();
                }
            }}>
                OK
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

        </DialogContent>

        
    );
};

export default EditPayment;
