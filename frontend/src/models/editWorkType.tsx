import { useState } from 'react';
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
import { UPDATE_WORK_TYPE } from '@/graphql/query/work-type.query';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditWorkTypeProps {
    id: string;
    initialWorkTypeName: string;
    initialDescription: string;
}

export function EditWorkType({
    id,
    initialWorkTypeName,
    initialDescription
}: EditWorkTypeProps) {
    const [workTypeData, setWorkTypeData] = useState({
        workTypeName: initialWorkTypeName,
        description: initialDescription,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [updateWorkType, { loading }] = useMutation(UPDATE_WORK_TYPE);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [isModalOpen, setIsModalOpen] = useState(false);  // New state for modal visibility

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWorkTypeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsDialogOpen(false);

        if (!workTypeData.workTypeName || !workTypeData.description) {
            setDialogType('error');
            setDialogTitle('Validation Error');
            setDialogMessage('All fields are required.');
            setIsDialogOpen(true);
            return;
        }

        try {
            const { data } = await updateWorkType({
                variables: {
                    workTypeId: id,
                    input: {
                        name: workTypeData.workTypeName,
                        description: workTypeData.description,
                    },
                },
            });

            if (data?.updateWorkType?.status?.success) {
                setDialogType('success');
                setDialogTitle('Success');
                setDialogMessage('Work Type updated successfully.');
            } else {
                setDialogType('error');
                setDialogTitle('Error');
                setDialogMessage(
                    data?.updateWorkType?.status?.message || 'Failed to update work type.'
                );
            }
        } catch (error) {
            console.error('Error updating work type: ', error);
            setDialogType('error');
            setDialogTitle('Unexpected Error');
            setDialogMessage('An unexpected error occurred.');
        }

        setIsDialogOpen(true);

        // Set a timeout to close the dialog and modal after 2 seconds
        setTimeout(() => {
            setIsDialogOpen(false);  // Close the dialog
            setIsModalOpen(false);  // Close the modal
        }, 2000);
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>  {/* Pass modal visibility here */}
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm"  onClick={() => setIsModalOpen(true)}>
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Work Type</DialogTitle>
                </DialogHeader>
                <hr className="my-4 border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="workTypeName" className="text-sm font-medium">Work Type Name</label>
                        <input
                            type="text"
                            name="workTypeName"
                            id="workTypeName"
                            value={workTypeData.workTypeName}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Work Type Name"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-sm font-medium">Work Type Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={workTypeData.description}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Work Type Description"
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
                
                {/* Alert Dialog for Success/Error Message */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
}
