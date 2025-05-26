import { gql } from "@apollo/client";

export const GET_ALL_TEAMS = gql`
query AllTeams {
  allTeams {
    id
    teamId
    name
    teamName
  }
}
`
export const GET_LATEST_TEAM_ID = gql`  
query Data {
  latestTeamId {
    data {
      teamId
    }
  }
}
  `;