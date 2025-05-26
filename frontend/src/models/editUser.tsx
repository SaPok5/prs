import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER_MUTATION } from "@/graphql/user/queries";
import { ALL_TEAMS_QUERY } from "@/graphql/queries";
import { DISPLAY_ROLES } from "@/graphql/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
  onUpdate: () => void;
}

interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  team: {
    teamId: string;
    teamName: string;
  };
  role: Array<{
    roleId: string;
    role: {
      roleName: string;
    };
  }>;
}

interface Team {
  id: string;
  teamId: string;
  name: string;
  teamName: string;
  organizationId: string;
}

interface Role {
  id: string;
  roleName: string;
  description: string;
  createdAt: string;
}

const EditUserModal = ({
  isOpen,
  onClose,
  userData,
}: EditUserModalProps) => {
  const { data: teamsData, loading: teamsLoading } = useQuery(ALL_TEAMS_QUERY);
  const { data: rolesData, loading: rolesLoading } = useQuery(DISPLAY_ROLES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [editUser, { loading, error }] = useMutation(EDIT_USER_MUTATION);

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    teamId: "",
    roleId: "",
    id: "",
  });

  // Check if selected role is verifier
  const isVerifierRole = rolesData?.displayAllRolesOfOrganization?.roles?.find(
    (role: Role) => role.id === formData.roleId
  )?.roleName === "verifier";

  // Initialize form data when modal opens or userData changes
  useEffect(() => {
    if (userData) {
      const matchingTeam = teamsData?.allTeams?.find(
        (team: Team) => team.teamName === userData.team?.teamName
      );

      const matchingRole = rolesData?.displayAllRolesOfOrganization?.roles?.find(
        (role: Role) => role.roleName === userData.role[0]?.role?.roleName
      );

      setFormData({
        userId: userData.userId,
        fullName: userData.fullName,
        email: userData.email,
        teamId: matchingTeam?.id || "",
        roleId: matchingRole?.id || "",
        id: userData.id,
      });
    }
  }, [userData, teamsData, rolesData]);

  // Handle role change to reset team selection for verifier
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "roleId") {
      const selectedRole = rolesData?.displayAllRolesOfOrganization?.roles?.find(
        (role: Role) => role.id === value
      );
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Reset teamId to empty string if verifier is selected
        teamId: selectedRole?.roleName === "verifier" ? "" : prev.teamId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return;

    try {
        const {data} = await editUser({
            variables: {
                userId: userData.id,
                input: {
                    fullName: formData.fullName,
                    email: formData.email,
                    teamId: isVerifierRole ? null : formData.teamId,
                    roleId: formData.roleId,
                },
            },
        });
        setDialogType('success');
        setDialogTitle('Success');
        setDialogMessage(data.editUser.status.message);
        setIsDialogOpen(true);

        // Close both the dialog and the modal after 2 seconds
        setTimeout(() => {
          setIsDialogOpen(false);
          onClose();  // Close the Edit User Modal
        }, 2000);
    } catch (err) {
        console.error("Error updating user:", err);
        setDialogType('error');
        setDialogTitle('Error');
        setDialogMessage('Failed to update user. Please try again later.');
        setIsDialogOpen(true);

        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 2000);
    }
};

if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          {/* User ID Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Full Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              {rolesData?.displayAllRolesOfOrganization?.roles?.map(
                (role: Role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                )
              )}
            </select>
            {rolesLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading roles...</p>
            )}
          </div>

          {/* Team Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Team
            </label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isVerifierRole}
            >
              <option value="">{isVerifierRole ? "All" : "Select team"}</option>
              {!isVerifierRole && teamsData?.allTeams?.map((team: Team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
            {teamsLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading teams...</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || teamsLoading || rolesLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
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
      </div>
    </div>
  );
};

export default EditUserModal;
