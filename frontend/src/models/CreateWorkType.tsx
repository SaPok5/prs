import { useState } from 'react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from '@apollo/client';
import { ADD_WORK_TYPE } from '@/graphql/query/work-type.query';

export function CreateWorkType({ refetch }: { refetch: () => void }) {
    const [workTypeData, setWorkTypeData] = useState({
        name: '',
        description: '',
    });
    const [alertState, setAlertState] = useState<{
        open: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        open: false,
        type: 'success',
        message: ''
    });
    const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State to control dialog visibility
    const [createWorkType, { loading }] = useMutation(ADD_WORK_TYPE);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWorkTypeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workTypeData.name || !workTypeData.description) {
            setAlertState({
                open: true,
                type: 'error',
                message: 'All fields are required.'
            });
            return;
        }

        try {
            const { data } = await createWorkType({
                variables: {
                    input: {
                        name: workTypeData.name,
                        description: workTypeData.description,
                    },
                },
            });

            if (data?.addWorkType?.status?.success) {
                setAlertState({
                    open: true,
                    type: 'success',
                    message: data?.addWorkType?.status?.message || 'Work Type created successfully.'
                });
                setWorkTypeData({ name: '', description: '' });
                refetch();

                // Close the dialog after 2 seconds
                setTimeout(() => {
                    setDialogOpen(false); // Close the Create Work Type dialog
                    setAlertState({ open: false, type: 'success', message: '' }); // Close the alert
                }, 2000);

            } else {
                setAlertState({
                    open: true,
                    type: 'error',
                    message: data?.addWorkType?.status?.message || 'Failed to create work type.'
                });

                // Close the dialog after 2 seconds
                setTimeout(() => {
                    setDialogOpen(false); // Close the Create Work Type dialog
                    setAlertState({ open: false, type: 'error', message: '' }); // Close the alert
                }, 2000);
            }
        } catch (error) {
            console.error('Error creating work type: ', error);
            setAlertState({
                open: true,
                type: 'error',
                message: 'An unexpected error occurred.'
            });

            // Close the dialog after 2 seconds
            setTimeout(() => {
                setDialogOpen(false); // Close the Create Work Type dialog
                setAlertState({ open: false, type: 'error', message: '' }); // Close the alert
            }, 2000);
        }
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center" onClick={() => setDialogOpen(true)}>
                        <Plus className="mr-2" /> Create Work Type
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Work Type</DialogTitle>
                    </DialogHeader>
                    <hr className="my-4 border-gray-300" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium">Work Type Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={workTypeData.name}
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
                                {loading ? 'Saving...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for Success/Error Messages */}
            <AlertDialog open={alertState.open} onOpenChange={closeAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={alertState.type === 'success' ? 'text-black-600' : 'text-red-600'}>
                            {alertState.type === 'success' ? 'Success' : 'Error'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertState.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={closeAlert}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
