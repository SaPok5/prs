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
import { gql } from '@apollo/client';

const ADD_SOURCE_TYPE = gql`
  mutation AddSourceType($input: SourceTypeInput) {
    addSourceType(input: $input) {
      status {
        success
        message
      }
      data {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export function CreateSourceType({ refetch }: { refetch: () => void }) {
    const [sourceTypeData, setSourceTypeData] = useState({
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
    const [addSourceType, { loading }] = useMutation(ADD_SOURCE_TYPE);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSourceTypeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sourceTypeData.name || !sourceTypeData.description) {
            setAlertState({
                open: true,
                type: 'error',
                message: 'All fields are required.'
            });
            return;
        }

        try {
            const { data } = await addSourceType({
                variables: {
                    input: {
                        name: sourceTypeData.name,
                        description: sourceTypeData.description,
                    },
                },
            });

            if (data?.addSourceType?.status?.success) {
                setAlertState({
                    open: true,
                    type: 'success',
                    message: data?.addSourceType?.status?.message || 'Source Type created successfully.'
                });
                setSourceTypeData({ name: '', description: '' });
                refetch();
            } else {
                setAlertState({
                    open: true,
                    type: 'error',
                    message: data?.addSourceType?.status?.message || 'Failed to create source type.'
                });
            }
        } catch (error) {
            console.error('Error creating source type: ', error);
            setAlertState({
                open: true,
                type: 'error',
                message: 'An unexpected error occurred.'
            });
        }
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" >
                        <Plus className="mr-2" /> Create Source Type
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Source Type</DialogTitle>
                    </DialogHeader>
                    <hr className="my-4 border-gray-300" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium">Source Type Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={sourceTypeData.name}
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
                        <AlertDialogTitle className={
                            alertState.type === 'success' 
                                ? 'text-black-600' 
                                : 'text-red-600'
                        }>
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