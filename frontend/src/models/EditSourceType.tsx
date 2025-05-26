import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from '@apollo/client';
import { UPDATE_SOURCE_TYPE } from '@/graphql/query/source-type.query';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditSourceTypeProps {
    id: string;
    initialSourceTypeName: string;
    initialDescription: string;
}

export function EditSourceType({
    id,
    initialSourceTypeName,
    initialDescription
}: EditSourceTypeProps) {
    const [sourceTypeData, setSourceTypeData] = useState({
        sourceTypeName: initialSourceTypeName,
        description: initialDescription,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [updateSourceType, { loading }] = useMutation(UPDATE_SOURCE_TYPE);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls main form visibility
    const [alertDialogOpen, setAlertDialogOpen] = useState(false); // Controls success/error alert visibility
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSourceTypeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!sourceTypeData.sourceTypeName || !sourceTypeData.description) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            const { data } = await updateSourceType({
                variables: {
                    id: id,
                    input: {
                        name: sourceTypeData.sourceTypeName,
                        description: sourceTypeData.description,
                    },
                },
            });

            if (data?.updateSourceType?.status?.success) {
                setDialogType('success');
                setDialogTitle('Success');
                setDialogMessage('Source type updated successfully.');
            } else {
                setDialogType('error');
                setDialogTitle('Error');
                setDialogMessage(
                    data?.updateSourceType?.status?.message || 'Failed to update source type.'
                );
            }
        } catch (error) {
            console.error('Error updating source type: ', error);
            setDialogType('error');
            setDialogTitle('Error');
            setDialogMessage('An unexpected error occurred.');
        }

        // Show the alert dialog
        setAlertDialogOpen(true);
    };

    useEffect(() => {
        if (alertDialogOpen && dialogType === 'success') {
            const timer = setTimeout(() => {
                setAlertDialogOpen(false); // Close the alert dialog
                setIsDialogOpen(false);   // Close the main form dialog after success
            }, 2000); // Auto-close after 2 seconds
            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [alertDialogOpen, dialogType]);

    const handleCloseAlert = () => {
        setAlertDialogOpen(false);  // Close the alert dialog
        setIsDialogOpen(false);     // Close the main form dialog when success
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            <Button
                    variant="ghost"
                   className="h-8 w-8 p-0"
                    aria-label="Edit Team"
                >
                    <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Source Type</DialogTitle>
                </DialogHeader>
                <hr className="my-4 border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="sourceTypeName" className="text-sm font-medium">Source Type Name</label>
                        <input
                            type="text"
                            name="sourceTypeName"
                            id="sourceTypeName"
                            value={sourceTypeData.sourceTypeName}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Source Type Name"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-sm font-medium">Source Type Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={sourceTypeData.description}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Source Type Description"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            className="bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
                <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className={dialogType === 'success' ? 'text-black-500' : 'text-red-500'}>
                                {dialogTitle}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {dialogMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleCloseAlert}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
}
