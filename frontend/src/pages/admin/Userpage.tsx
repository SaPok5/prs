import { useState } from 'react';
import { Search, UserPlus, UserCog, Trash2, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddUserModal from '@/models/AddUserForm';
import EditUserModal from '@/models/editUser';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '@/graphql/queries';
import { DELETE_USER_MUTATION } from '@/graphql/user/queries';
import SwitchTeam from './SwitchTeam';
import { ChangeUserPassword } from './ChangeUserPassword';
import { Button } from '@/components/ui/button';

export interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: Array<{
    roleId: string;
    role: {
      roleName: string;
    };
  }>;
  team: {
    teamId: string;
    teamName: string;
  };
}

const UserManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSwitchTeamUserId, setOpenSwitchTeamUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deletionMessage, setDeletionMessage] = useState<string | null>(null); // Store success/error message
  const [isDeleting, setIsDeleting] = useState(false); // Track the deletion status (in progress or not)

  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);

  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      setDeletionMessage('User successfully deleted.');
      setIsDeleting(false); // End the deletion process
      refetch();
    },
    onError: (err) => {
      setDeletionMessage(`Error: ${err.message}`);
      setIsDeleting(false); // End the deletion process
    }
  });

  const handleToggleSwitchTeam = (userId: string) => {
    setOpenSwitchTeamUserId(prevUserId => (prevUserId === userId ? null : userId));
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true); // Start the deletion process
      try {
        await deleteUser({
          variables: { userId: userToDelete },
        });
        setUserToDelete(null); // Reset after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const filteredUsers = data?.gettAllUsers?.filter((user: User) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8 mx-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="outline"
            className="flex items-center"
          >
            <UserPlus className="h-5 w-5" />
            Add User
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User Type</th>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                  <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">{user.userId}</td>
                    <td className="px-8 py-5 text-sm text-gray-900 font-medium truncate">{user.fullName}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">{user.email}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">
                      {user.role[0]?.role?.roleName || '-'}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 truncate">
                      {user.team?.teamName || '-'}
                    </td>
                    <td className="px-2 py-5 text-sm">
                      <div className="flex gap-3">
                        <ChangeUserPassword id={user.id} />
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </button>

                        <div className="relative">
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => handleToggleSwitchTeam(user.id)}
                          >
                            <UserCog className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </button>

                          {openSwitchTeamUserId === user.id && (
                            <div className="absolute left-0 mt-2 w-[200px] bg-white shadow-md rounded-lg z-10">
                              <SwitchTeam userId={user.id} />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive View for Mobile */}
          <div className="sm:hidden divide-y divide-gray-200">
            {filteredUsers.map((user: User) => (
              <div key={user.id} className="p-4">
                <p className="text-sm font-medium text-gray-900">ID: {user.userId}</p>
                <p className="text-sm font-medium text-gray-900">Name: {user.fullName}</p>
                <p className="text-sm text-gray-500">Email: {user.email}</p>
                <p className="text-sm text-gray-500">User Type: {user.role[0]?.role?.roleName || '-'}</p>
                <p className="text-sm text-gray-500">Team: {user.team?.teamName || '-'}</p>
                <div className="flex gap-3 mt-4">
                  <ChangeUserPassword id={user.id} />
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Pencil className="h-5 w-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleToggleSwitchTeam(user.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <UserCog className="h-5 w-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        isAddModalOpen && <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => refetch()}
        />
      }

      {
        isEditModalOpen && <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={selectedUser}
          onUpdate={() => refetch()}
        />
      }



      <AlertDialog open={!!userToDelete || !!deletionMessage} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deletionMessage ? 'Status' : 'Are you absolutely sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {deletionMessage ? deletionMessage : 'This action cannot be undone. This will permanently delete the user and remove their data from our servers.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setUserToDelete(null);  // Close dialog when "Close" is clicked
              setDeletionMessage(null); // Reset deletion message
            }}>
              {deletionMessage ? 'Close' : 'Cancel'}
            </AlertDialogCancel>
            {!deletionMessage && (
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
               {isDeleting ? "Deleting...":"Delete"} 
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
