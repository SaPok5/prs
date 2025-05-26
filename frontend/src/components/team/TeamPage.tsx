import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Plus, Search, Trash } from "lucide-react";
import { CreateTeam } from "./CreateTeam";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { EditTeam } from "./EditTeam";
import { GET_ALL_TEAMS } from "@/graphql/query/teams.query";
import { DELETE_TEAM_MUTATION } from "@/graphql/mutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

const TeamPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_TEAMS);
  const [deleteTeam, { loading: deleting }] = useMutation(DELETE_TEAM_MUTATION);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const organizationId = "your-organization-id";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading teams: {error.message}</div>;

  const teams = data?.allTeams || [];

  // Filter teams based on search query
  const filteredTeams = teams.filter((team: { teamName: string }) =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (teamId: string) => {
    setTeamToDelete(teamId);
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;

    try {
      const { data } = await deleteTeam({ variables: { id: teamToDelete } });

      if (data?.deleteTeams?.status?.success) {
        setDialogMessage("Team deleted successfully.");
        setSuccessDialogOpen(true);
        refetch();
      } else {
        setDialogMessage(
          data?.deleteTeams?.status?.message || "Failed to delete team."
        );
        setErrorDialogOpen(true);
      }
    } catch (err) {
      console.error("Error deleting team:", err);
      setDialogMessage("An unexpected error occurred while deleting the team.");
      setErrorDialogOpen(true);
    } finally {
      setDeleteDialogOpen(false); // Close the confirmation dialog
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8 mx-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search team names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button
            onClick={() => setShowCreateTeam(true)}
            variant="outline"
            className="flex items-center"
          >
            <Plus className="mr-2" /> Create Team
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <thead className="bg-gray-200">
                <TableRow>
                  <TableHead className="w-[10%] px-8 py-4">Team ID</TableHead>
                  <TableHead className="w-[10%] pl-[192px] px-8 py-4">
                    Team Name
                  </TableHead>
                  <TableHead className="w-[10%] px-8 py-4">Action</TableHead>
                </TableRow>
              </thead>
              <TableBody className="divide-y divide-gray-200">
                {filteredTeams.map(
                  (team: { id: string; teamId: string; teamName: string }) => (
                    <TableRow key={team.id}>
                      <TableCell className="px-8 py-4 text-sm text-gray-700">
                        {team.teamId}
                      </TableCell>
                      <TableCell className="pl-[350px] px-8 py-4 text-sm text-gray-700">
                        {team.teamName}
                      </TableCell>
                      <TableCell className="px-8 py-4 text-sm text-gray-700 flex items-center">
                        <EditTeam
                          id={team.id}
                          initialTeamName={team.teamName}
                        />
                        <Button
                          onClick={() => handleDelete(team.id)}
                          variant="ghost"
                           size="sm"
                          disabled={deleting}
                        >
                          <Trash className="h-4 w-4  text-red-500 hover:text-red-700" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this team?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setDeleteDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </AlertDialogAction>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Message Dialog */}
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Message Dialog */}
      <AlertDialog open={isErrorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showCreateTeam && (
        <CreateTeam
          onClose={() => setShowCreateTeam(false)}
          refetch={refetch}
          organizationId={organizationId}
        />
      )}
    </div>
  );
};

export default TeamPage;
