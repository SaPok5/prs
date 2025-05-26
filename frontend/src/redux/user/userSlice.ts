import { Users } from "@/types/user.types";
import { createSlice } from "@reduxjs/toolkit";


type UsersType={
    latestOrganizatinUserId: number;
    usersList: Users[];
}

interface IUserState {
    user:UsersType
}

const initialState: UsersType = {
  latestOrganizatinUserId: 0,
  usersList: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLatestOrganizationUserId(state, action) {
      state.latestOrganizatinUserId = action.payload;
    },
    setUserList(state, action) {
      state.usersList = action.payload.usersList;
    },
    addUser(state, action) {
      state.usersList.push(action.payload.user);
    },
    removeUser(state, action) {
      state.usersList = state.usersList.filter(
        (user) => user.id !== action.payload.id
      );
    },
  },
});

export const { setLatestOrganizationUserId, setUserList, addUser,removeUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUserState = (state: IUserState) => state.user;
export const selectLatestOrganizatinUserId = (state: IUserState) =>
  state.user.latestOrganizatinUserId;
export const selectUserList = (state: IUserState) => state.user.usersList;

