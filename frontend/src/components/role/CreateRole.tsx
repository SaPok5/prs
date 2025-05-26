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
import gql from 'graphql-tag';

// Define the GraphQL mutation
const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: RoleInput) {
    createRole(input: $input) {
      role {
        id
        description
        createdAt
        roleName
      }
    }
  }
`;

export function CreateRole({ refetch }: { refetch: () => void }) {
    const [roleData, setRoleData] = useState({
        roleName: '',
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
    const [createRole, { loading }] = useMutation(CREATE_ROLE_MUTATION);
    const [isDialogOpen, setIsDialogOpen] = useState(false); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!roleData.roleName || !roleData.description) {
            setAlertState({
                open: true,
                type: 'error',
                message: 'All fields are required.'
            });
            return;
        }

        try {
            const { data } = await createRole({
                variables: {
                    input: {
                        roleName: roleData.roleName,
                        description: roleData.description,
                    },
                },
            });

            if (data?.createRole?.role) {
                setAlertState({
                    open: true,
                    type: 'success',
                    message: 'Role created successfully.'
                });
                setRoleData({ roleName: '', description: '' });
                refetch(); 

            
                setTimeout(() => {
                    setAlertState(prev => ({ ...prev, open: false }));
                    setIsDialogOpen(false); 
                }, 2000);
            } else {
                setAlertState({
                    open: true,
                    type: 'error',
                    message: 'Failed to create role.'
                });

                setTimeout(() => {
                    setAlertState(prev => ({ ...prev, open: false }));
                }, 2000); 
            }
        } catch (error) {
            console.error('Error creating role: ', error);
            setAlertState({
                open: true,
                type: 'error',
                message: 'An unexpected error occurred.'
            });

            setTimeout(() => {
                setAlertState(prev => ({ ...prev, open: false }));
            }, 2000); 
        }
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center ">
                        <Plus className="mr-2" /> Create Role
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Role</DialogTitle>
                    </DialogHeader>
                    <hr className="my-4 border-gray-300" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="roleName" className="text-sm font-medium">Role Name</label>
                            <input
                                type="text"
                                name="roleName"
                                id="roleName"
                                value={roleData.roleName}
                                onChange={handleInputChange}
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Enter Role Name"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-sm font-medium">Role Description</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={roleData.description}
                                onChange={handleInputChange}
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Enter Role Description"
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
