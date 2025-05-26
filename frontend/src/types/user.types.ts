export type Users = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  roleId: string | null;
  roleName: string | null;
  team: string | null;
  teamId: string | null;
  password?: string;
};
