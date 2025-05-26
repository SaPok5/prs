import { useState, useEffect, FormEvent } from 'react';
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
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the GraphQL mutation
const EDIT_ROLE_MUTATION = gql`
  mutation EditRole($input: RoleEditInput!) {
    editRole(input: $input) {
      status {
        success
        message
      }
      role {
        roleName
        description
      }
    }
  }
`;

interface EditRoleProps {
    id: string;
    initialRoleName: string;
    initialDescription: string;
    onSuccess?: (updatedRole: { id: string, roleName: string, description: string }) => void;
    refetch: () => void; 
}

export function EditRole({ id, initialRoleName, initialDescription, onSuccess, refetch }: EditRoleProps) {
    const [roleData, setRoleData] = useState({
        id,
        roleName: initialRoleName,
        description: initialDescription,
    });
    const [editRole, { loading }] = useMutation(EDIT_ROLE_MUTATION);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

    // Update state when props change
    useEffect(() => {
        setRoleData({
            id,
            roleName: initialRoleName,
            description: initialDescription,
        });
    }, [id, initialRoleName, initialDescription]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await editRole({
                variables: { input: roleData },
            });

            if (data?.editRole?.status?.success) {
                setDialogTitle('Success');
                setDialogMessage('Role updated successfully.');
                setIsDialogOpen(true);

                
                setTimeout(() => {
                    setIsDialogOpen(false);
                    setIsEditRoleOpen(false); 
                }, 3000); 

                // Refetch roles data after successful update
                refetch();

                if (onSuccess) {
                    onSuccess({
                        id: roleData.id,
                        roleName: roleData.roleName,
                        description: roleData.description,
                    });
                }
            } else {
                setDialogTitle('Error');
                setDialogMessage(data?.editRole?.status?.message || 'Failed to update the role.');
                setIsDialogOpen(true);
            }
        } catch (err) {
            console.error('Error updating role:', err);
            setDialogTitle('Error');
            setDialogMessage('An unexpected error occurred while updating the role.');
            setIsDialogOpen(true);
        }
    };

    return (
        <>
            <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
                <DialogTrigger asChild>
                    <Button
                    variant="ghost"
                    size="sm"
                        className="text-blue-500 flex items-center"
                        aria-label="Edit Role"
                    >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700"  />
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                    </DialogHeader>
                    <hr className="my-4 border-gray-300" />

                    <form onSubmit={handleSubmit} className="space-y-6">
 

                        {/* Role Name */}
                        <div className="flex flex-col">
                            <label htmlFor="roleName" className="text-sm font-medium">
                                Role Name
                            </label>
                            <input
                                type="text"
                                name="roleName"
                                id="roleName"
                                value={roleData.roleName}
                                onChange={handleInputChange}
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Enter Role Name"
                                aria-label="Role Name"
                                required
                                disabled
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-sm font-medium">
                                Role Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={roleData.description}
                                onChange={handleInputChange}
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Enter Role Description"
                                aria-label="Role Description"
                                required
                            />
                        </div>

                        <DialogFooter>
                            <div className="flex justify-center items-center mt-6">
                                <Button
                                    className="text-center bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* AlertDialog for Success/Error Messages */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                            Close
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
