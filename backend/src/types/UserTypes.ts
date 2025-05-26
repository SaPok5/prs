import { io } from "../socket/socket.js";

export interface OrganizationType {
    email: string;
    organizationName: string;
    password: string;
}
  
export interface LoginType {
    email: string;
    password: string;
}

export interface LoginInputType{
    input:LoginType
}

// Define types for createUser function
export interface CreateUserInput {
  email: string;
  fullName: string;
  password: string;
  userId: string;
  teamId?: string; // Optional
  roleId: string; // Assuming roleId is passed to create the link
}

export interface CreateUserInputArgs {
  input: CreateUserInput;
}

// Based on the createUser function's return structure
interface UserRoleInfo {
  roleId: string;
  role: {
    roleName: string;
  };
}

interface UserTeamInfo {
  teamId: string;
  teamName: string;
}

export interface CreatedUserData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRoleInfo[];
  team: UserTeamInfo | null;
}

export interface CreateUserSuccessReturn {
  status: { success: true; message: string };
  data: CreatedUserData;
}

export interface CreateUserErrorReturn {
  status: {
    success: false;
    message: string;
    errors?: Array<{ field: string; message: string }>;
  };
  data?: never; // No data on error
}

export type CreateUserReturnType = CreateUserSuccessReturn | CreateUserErrorReturn;

export interface User {
    organizationId: string;
    userId:string;
}
  
export interface Context {
    user: User | null;
    io: typeof io;
}
