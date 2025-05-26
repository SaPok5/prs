import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { GET_LATEST_TEAM_ID } from '@/graphql/query/teams.query';
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
const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeams($input: TeamInput) {
    createTeams(input: $input) {
      data {
        id
        organizationId
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

export function CreateTeam({ refetch, organizationId, onClose }: { refetch: () => void, organizationId: string, onClose:any }) {
  const [teamData, setTeamData] = useState({
    teamId: '',
    teamName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [createTeam, { loading }] = useMutation(CREATE_TEAM_MUTATION);

  // Dialog states
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  // Fetch the latest team ID
  const { data, loading: teamLoading, error: teamError, refetch: refetchLatestTeamId } = useQuery(GET_LATEST_TEAM_ID, {
    variables: { organizationId },
  });

  useEffect(() => {
    if (data && data.latestTeamId && data.latestTeamId.data) {
      const latestTeamId = data.latestTeamId.data.teamId;
      const numericPart = parseInt(latestTeamId.replace(/[^\d]/g, ''), 10);
      const incrementedTeamId = `t-${(numericPart + 1).toString().padStart(3, '0')}`;
      setTeamData((prevData) => ({
        ...prevData,
        teamId: incrementedTeamId,
      }));
    } else {
      // Set default team ID when data is null
      setTeamData((prevData) => ({
        ...prevData,
        teamId: 'tm-1',
      }));
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!teamData.teamId || !teamData.teamName) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await createTeam({
        variables: {
          input: {
            teamId: teamData.teamId,
            teamName: teamData.teamName,
          },
        },
      });

      if (data.createTeams.status.success) {
        setDialogTitle("Team Created Successfully");
        setDialogMessage(data.createTeams.status.message);
        setIsSuccessDialogOpen(true);
        setTeamData({ teamId: '', teamName: '' });

        // Refetch data and close dialogs after 2 seconds
        refetch();
        await refetchLatestTeamId();

        // Close both the success dialog and the create team dialog after 2 seconds
        setTimeout(() => {
          onClose()
          // setIsCreateTeamDialogOpen(false); // Close the Create Team dialog
          setIsSuccessDialogOpen(false);    // Close the Success dialog
        }, 2000);
      } else {
        setErrorMessage(data.createTeams.status.message || 'Failed to create team.');
      }
    } catch (error) {
      console.error('Error creating team: ', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  if (teamLoading) return <p>Loading latest team ID...</p>;
  if (teamError) return <p>Error fetching latest team ID: {teamError.message}</p>;

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        {/* <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
            <Plus className="mr-2" /> Create Team
          </Button>
        </DialogTrigger> */}

        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>
          <hr className="my-4 border-gray-300" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            {/* Team ID */}
            <div className="flex flex-col">
              <label htmlFor="teamId" className="text-sm font-medium">Team ID</label>
              <input
                type="text"
                name="teamId"
                id="teamId"
                value={teamData.teamId}
                onChange={handleInputChange}
                className="w-full h-10 border p-2 rounded-md"
                placeholder="Enter Team ID"
                required
                disabled 
              />
            </div>

            {/* Team Name */}
            <div className="flex flex-col">
              <label htmlFor="teamName" className="text-sm font-medium">Team Name</label>
              <input
                type="text"
                name="teamName"
                id="teamName"
                value={teamData.teamName}
                onChange={handleInputChange}
                className="w-full h-10 border p-2 rounded-md"
                placeholder="Enter Team Name"
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

      {/* Success/Error Dialog */}
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
