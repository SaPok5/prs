import { useQuery, useMutation, gql } from '@apollo/client';
import { Search, Trash } from 'lucide-react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../ui/table';
import { EditRole } from './EditRole';
import { CreateRole } from './CreateRole';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '../ui/button';

interface Role {
  id: string;
  roleName: string;
  description: string;
}

const GET_ALL_ROLE = gql`
  query Roles {
    displayAllRolesOfOrganization {
      roles {
        id
        roleName
        description
      }
      status {
        success
      }
    }
  }
`;

const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($deleteRoleId: String) {
    deleteRole(id: $deleteRoleId) {
      message
      success
    }
  }
`;

const RolePage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ROLE);
  const [deleteRole, { loading: deleting }] = useMutation(DELETE_ROLE_MUTATION);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading roles: {error.message}</div>;

  // Extract and filter roles based on search term
  const roles = data?.displayAllRolesOfOrganization?.roles || [];
  const filteredRoles = roles.filter((role: Role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDialogMessage('Are you sure you want to delete this role?');
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRoleId) return;

    try {
      const { data } = await deleteRole({ variables: { deleteRoleId: selectedRoleId } });
      if (data?.deleteRole?.success) {
        setDialogMessage('Role deleted successfully.');
        refetch();
      } else {
        setDialogMessage(data?.deleteRole?.message || 'Failed to delete role.');
      }
      setIsDialogOpen(true);
    } catch (err) {
      console.error('Error deleting role:', err);
      setDialogMessage('An unexpected error occurred while deleting the role.');
      setIsDialogOpen(true);
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
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <CreateRole refetch={refetch} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <thead className="bg-gray-200">
                <TableRow>
                  <TableHead className="w-[20%] px-8 py-4">S.N.</TableHead>
                  <TableHead className="w-[20%] px-8 py-4">Role Name</TableHead>
                  <TableHead className="w-[10%] px-8 py-4">Description</TableHead>
                  <TableHead className="w-[10%] px-8 py-4">Action</TableHead>
                </TableRow>
              </thead>
              <TableBody className="divide-y divide-gray-200">
                {filteredRoles.map((role: Role, idx:number) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-8 py-4 text-sm text-gray-700">
                      {idx+1}
                    </TableCell>
                    <TableCell className="px-8 py-4 text-sm text-gray-700" style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}>
                      {role.roleName}
                    </TableCell>
                    <TableCell className="px-8 py-4 text-sm text-gray-700"  style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}>
                      {role.description}
                    </TableCell>
                    <TableCell className="px-8 py-4 text-sm text-gray-700 flex items-center">
                      {role.id && typeof role.id === 'string' && role.roleName ? (
                         <EditRole
                         id={role.id}
                         initialRoleName={role.roleName}
                         initialDescription={role.description}
                         refetch={refetch} 
                       />
                      ) : (
                        <div>Invalid ID or Name</div>
                      )}

                      <Button
                      variant="ghost"
                      size="sm"
                        onClick={() => handleDelete(role.id)}
                        disabled={deleting}
                      >
                          <Trash className="h-4 w-4  text-red-500 hover:text-red-700" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* AlertDialog for showing confirmation, success, and error messages */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Close</AlertDialogCancel>
            {dialogMessage === 'Are you sure you want to delete this role?' && (
              <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolePage;