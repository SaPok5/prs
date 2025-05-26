import { Team } from "@/types/team.types";
import { createSlice } from "@reduxjs/toolkit";

type TeamType = {
  teams: Team[];
};

interface ITeamState {
  team: TeamType;
}

const initialState: TeamType = {
  teams: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    addTeam: (state, action) => {
      state.teams.push(action.payload.team);
    },
    removeTeam: (state, action) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload.id);
    },
  },
});

export const {setTeams} = teamSlice.actions;
export default teamSlice.reducer;
export const selectTeamsList = (state:ITeamState) => state.team.teams;