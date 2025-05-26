// import React, { useState } from 'react';
// import { Search, UserPlus, CreditCard, UserCog, Trash2, Pencil } from 'lucide-react';

// import AddUserModal from '@/models/addUser';
// import EditUserModal from '@/models/editUser';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_ALL_USERS } from '@/graphql/queries';
// import { DELETE_USER_MUTATION } from '@/graphql/user/queries';
// import SwitchTeam from './SwitchTeam';
// import { ChangeUserPassword } from './ChangeUserPassword';

// export interface User {
//   id: string;
//   userId: string;
//   fullName: string;
//   email: string;
//   role: Array<{
//     role: {
//       roleName: string;
//     };
//   }>;
//   team: {
//     teamName: string;
//   };
// }

// const UserManagement = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [openSwitchTeamUserId, setOpenSwitchTeamUserId] = useState<string | null>(null);

//   const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);

//   const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
//     onCompleted: () => {
//       refetch();
//     },
//   });

//   const handleToggleSwitchTeam = (userId: string) => {
//     setOpenSwitchTeamUserId(prevUserId => (prevUserId === userId ? null : userId));
//   };

//   const handleDeleteUser = async (userId: string) => {
//     console.log('Attempting to delete user with ID:', userId);
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await deleteUser({
//           variables: { userId },
//         });
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleEditUser = (user: User) => {
//     console.log('Editing user:', user);
//     setSelectedUser(user);
//     setIsEditModalOpen(true);
//   };

//   // Filter users based on search query
//   const filteredUsers = data?.gettAllUsers?.filter((user: User) =>
//     user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   ) || [];

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 w-full">
//       <div className="w-full px-6 py-8">
//         {/* Header section */}
//         <div className="flex justify-between items-center mb-8 mx-4">
//           <div className="flex-1 max-w-md">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search by name or email"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-base font-medium ml-4"
//           >
//             <UserPlus className="h-5 w-5" />
//             Add User
//           </button>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="overflow-x-auto">
//             <table className="w-full table-fixed">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User Type</th>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Team</th>
//                   <th className="w-[10%] px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredUsers.map((user: User) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-8 py-5 text-sm text-gray-500 truncate">{user.userId}</td>
//                     <td className="px-8 py-5 text-sm text-gray-900 font-medium truncate">{user.fullName}</td>
//                     <td className="px-8 py-5 text-sm text-gray-500 truncate">{user.email}</td>
//                     <td className="px-8 py-5 text-sm text-gray-500 truncate">
//                       {user.role[0]?.role?.roleName || 'N/A'}
//                     </td>
//                     <td className="px-8 py-5 text-sm text-gray-500 truncate">
//                       {user.team?.teamName || 'N/A'}
//                     </td>
//                     <td className="px-8 py-5 text-sm">
//                       <div className="flex gap-3">
//                         <ChangeUserPassword id={user.id} />
//                         <button
//                           onClick={() => handleEditUser(user)}
//                           className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                           <Pencil className="h-5 w-5 text-blue-500" />
//                         </button>

//                         <div className="relative">
//                           <button
//                             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                             onClick={() => handleToggleSwitchTeam(user.id)}
//                           >
//                             <UserCog className="h-5 w-5 text-blue-500" />
//                           </button>

//                           {openSwitchTeamUserId === user.id && (
//                             <div className="absolute left-0 mt-2 w-[200px] bg-white shadow-md rounded-lg z-10">
//                               <SwitchTeam userId={user.id} />
//                             </div>
//                           )}
//                         </div>

//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                           <Trash2 className="h-5 w-5 text-red-500" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <AddUserModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onAdd={() => refetch()}
//       />

//       <EditUserModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         userData={selectedUser}
//         onUpdate={() => refetch()}
//       />
//     </div>
//   );
// };

// export default UserManagement;