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
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the GraphQL mutation
const EDIT_TEAM_MUTATION = gql`
  mutation EditTeams($input: EditTeamInput!) {
    editTeams(input: $input) {
      data {
        id
        teamId
        teamName
      }
      status {
        success
        message
      }
    }
  }
`;

interface EditTeamProps {
    id: string;
    initialTeamName: string;
    onSuccess?: (updatedTeam: { id: string, teamName: string }) => void;
}

export function EditTeam({ id, initialTeamName }: EditTeamProps) {
    const [teamData, setTeamData] = useState({
        id,
        teamName: initialTeamName,
    });
    const [editTeam, { loading }] = useMutation(EDIT_TEAM_MUTATION);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);  // Control the Edit Team Dialog visibility
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        setTeamData({
            id,
            teamName: initialTeamName,
        });
    }, [id, initialTeamName]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeamData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await editTeam({
                variables: { input: teamData },
            });

            if (data?.editTeams?.status?.success) {
                setDialogType('success');
                setDialogTitle('Success');
                setDialogMessage('Team updated successfully.');
            } else {
                setDialogType('error');
                setDialogTitle('Error');
                setDialogMessage(data?.editTeams?.status?.message || 'Failed to update the team.');
            }
        } catch (err) {
            console.error('Error updating team:', err);
            setDialogType('error');
            setDialogTitle('Error');
            setDialogMessage('An unexpected error occurred while updating the team.');
        }
        
        setIsDialogOpen(true);   // Open the AlertDialog
        setIsEditTeamDialogOpen(true); // Open the Edit Team dialog
        
        // Automatically close both the dialogs after 2 seconds
        setTimeout(() => {
            setIsDialogOpen(false);  // Close the AlertDialog
            setIsEditTeamDialogOpen(false);  // Close the EditTeam Dialog
        }, 2000);
    };

    return (
        <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                   className="h-8 w-8 p-0"
                    aria-label="Edit Team"
                >
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Team Name</DialogTitle>
                </DialogHeader>
                <hr className="my-4 border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Team Name */}
                    <div className="flex flex-col">
                        <label htmlFor="teamName" className="text-sm font-medium">
                            Team Name
                        </label>
                        <input
                            type="text"
                            name="teamName"
                            id="teamName"
                            value={teamData.teamName}
                            onChange={handleInputChange}
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Team Name"
                            aria-label="Team Name"
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
