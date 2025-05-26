import { createSlice } from "@reduxjs/toolkit";

export type authType = {
  id: string | null;
  email: string | null;
  organizationName: string | null;
  isVerified: Boolean | null;
  phoneNumber: string | null;
  fullName: string | null;
  token: string | null;
  role: string | null;
  userId: string | null;
  organizationId: string | null;
  teamId: string | null;
};

interface authState {
  auth: authType;
}

const initialState: authType = {
  id: null,
  email: null,
  organizationName: null,
  isVerified: null,
  phoneNumber: null,
  fullName: null,
  token: null,
  role: null,
  userId: null,
  organizationId: null,
  teamId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.organizationName = action.payload.organizationName;
      state.isVerified = action.payload.isVerified;
      state.phoneNumber = action.payload.phoneNumber;
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.organizationId = action.payload.organizationId;
      state.teamId = action.payload.teamId;
    },
    loggedOut: () => {
      return initialState;
    },
  },
});

export const { setCredentials,loggedOut } = authSlice.actions;
export default authSlice.reducer;
export const selectAuthUser = (state: authState) => state.auth;
export const selectCurrentToken = (state:authState) => state.auth.token;
export const selectAuthRole = (state:authState) => state.auth.role;
export const selectUserId = (state:authState) => state.auth.id;
export const selectOrganizationId = (state:authState) => state.auth.organizationId;
