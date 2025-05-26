import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER } from '@/graphql/user/mutation';
import { DISPLAY_ROLES } from '@/graphql/queries';
import { ALL_TEAMS_QUERY } from '@/graphql/queries';
import { FETCH_LATEST_USER } from '@/graphql/user/queries';
import { GET_ALL_USERS } from '@/graphql/queries';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Users } from '@/types/user.types';

interface Team {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  organizationId: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Omit<Users, 'id'>) => void;
}

interface Role {
  id: string;
  roleName: string;
  description: string;
  createdAt: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [createUser] = useMutation(CREATE_USER);
  const { data: rolesData, loading: rolesLoading } = useQuery(DISPLAY_ROLES);
  const { data: teamsData, loading: teamsLoading } = useQuery(ALL_TEAMS_QUERY);
  const { data: userIdData, loading: userIdLoading, refetch: refetchLatestUserId } = useQuery(FETCH_LATEST_USER, {
    fetchPolicy: 'network-only'
  });

  const [latestUserId, setLatestUserId] = useState<string>("");
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    userType: '',
    team: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (userIdData?.fetchLatestOrganizationUserId) {
      const fetchedUserId = userIdData.fetchLatestOrganizationUserId.userId;
      const prefix = "usr-";
      let currentNumber = 0;

      if (fetchedUserId) {
        if (fetchedUserId.startsWith(prefix)) {
          currentNumber = Number(fetchedUserId.split("-")[1]);
        } else {
          currentNumber = Number(fetchedUserId);
        }
      }

      const newUserId = !isNaN(currentNumber) && currentNumber > 0 
        ? `${prefix}${currentNumber + 1}` 
        : `${prefix}1`;

      setLatestUserId(newUserId);
      setFormData(prev => ({ ...prev, userId: newUserId }));
    }
  }, [userIdData]);

  const userTypes = rolesData?.displayAllRolesOfOrganization?.roles || [];
  const teams = teamsData?.allTeams || [];

  if (!isOpen) return null;
  if (rolesLoading || teamsLoading || userIdLoading) return <div className="text-center p-4">Loading...</div>;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.userType) newErrors.userType = 'User Type is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateForm()) {
      const selectedTeam = teams.find((team: Team) => team.teamId === formData.team);
  
      const mutationInput = {
        userId: formData.userId,
        fullName: formData.name,
        email: formData.email,
        roleId: formData.userType,
        password: formData.password,
      };
  
      if (selectedTeam?.id) {
        Object.assign(mutationInput, { teamId: selectedTeam.id });
      }
  
      try {
        const result = await createUser({
          variables: {
            input: mutationInput,
          },
          update: (cache, { data: { createUser } }) => {
            try {
              const existingUsers = cache.readQuery<{ gettAllUsers: Users[] }>({
                query: GET_ALL_USERS,
              });
  
              if (existingUsers) {
                cache.writeQuery({
                  query: GET_ALL_USERS,
                  data: {
                    gettAllUsers: [...existingUsers.gettAllUsers, createUser],
                  },
                });
              }
  
              cache.evict({ fieldName: 'fetchLatestOrganizationUserId' });
              cache.gc();
            } catch (error) {
              console.error('Error updating cache:', error);
            }
          },
        });
  
        if (result.data.createUser.status.success) {
          setDialogType('success');
          setDialogMessage('User created successfully!');
          setIsDialogOpen(true);

          await refetchLatestUserId();

          // Single timeout to handle both dialog and modal closing
          setTimeout(() => {
            setIsDialogOpen(false);
            setFormData({
              userId: '',
              name: '',
              email: '',
              userType: '',
              team: '',
              password: '',
              confirmPassword: '',
            });
            onClose(); // This will close the add user modal
          }, 2000);
        } else {
          setDialogType('error');
          setDialogMessage(result.data.createUser.status.message || 'Failed to create user.');
          setIsDialogOpen(true);

          setTimeout(() => {
            setIsDialogOpen(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error creating user:', error);
        setDialogType('error');
        setDialogMessage('There was an error creating the user.');
        setIsDialogOpen(true);
  
        
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 2000); 
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'userType') {
      const selectedRole = userTypes.find((role: Role) => role.roleName === value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedRole?.id || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  console.log(latestUserId, "latest suer id")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID and Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={latestUserId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoComplete="off" 
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoComplete="off" 
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* User Type and Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                name="userType"
                value={userTypes.find((type: Role) => type.id === formData.userType)?.roleName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userType ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select user type</option>
                {userTypes.length > 0 ?
                  userTypes.map((type: Role) => (
                    <option key={type.id} value={type.roleName}>
                      {type.roleName}
                    </option>
                  ))
                  :
                  <option disabled>No user types available</option>
                }
              </select>
              {errors.userType && (
                <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={userTypes.find((type: Role) => type.id === formData.userType)?.roleName === "verifier"}
              >
                {
                  userTypes.find((type: Role) => type.id === formData.userType)?.roleName === "verifier" ?  <option value="">All</option> :  <option value="">select team</option>
                }
                {/* <option value="">select team</option> */}
                {teams.length > 0 ?
                  teams.map((team: Team) => (
                    <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
                  ))
                  :
                  <option disabled>No teams available</option>
                }
              </select>
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="off" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add User
            </button>
          </div>
        </form>
      


      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogType === 'success' ? 'Success' : 'Error'}</AlertDialogTitle>
              <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={closeDialog}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default AddUserModal;