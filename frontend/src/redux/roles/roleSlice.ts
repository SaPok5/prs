import { RoleType } from "@/types/role.types";
import { createSlice } from "@reduxjs/toolkit";


type RolesType = {
  roles: RoleType[];
};

interface IRoleState {
    roles: RolesType;
  }
  

const initialState: RolesType = {
  roles: [],
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles(state, action) {
      state.roles = action.payload;
    },
    addRoles(state, action) {
      state.roles.push(action.payload);
    },
    removeRoles(state, action) {
      state.roles = state.roles.filter((role) => role.id !== action.payload.id);
    },
  },
});

export const { setRoles, addRoles, removeRoles } = roleSlice.actions;
export default roleSlice.reducer;
export const selectRoles = (state: IRoleState) => state.roles.roles;
