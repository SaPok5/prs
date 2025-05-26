import { gql } from "@apollo/client";

export const GET_ALL_USER = gql`
    query GettAllUsers {
        gettAllUsers {
            email
            fullName
            id
            userId
        }
    }
`;


 export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      status {
        message
        success
      }
    }
  }
`;

export const EDIT_USER_MUTATION = gql`
  mutation EditUser($userId: String!, $input: EditUserInput!) {
  editUser(userId: $userId, input: $input) {
    data {
      email
      fullName
      id
      role {
        role {
          roleName
        }
      }
      team {
        id
        teamId
        teamName
      }
      userId
    }
    status {
      success
      message
    }
  }
}
`;

 export const FETCH_LATEST_USER = gql`
  query FetchLatestOrganizationUserId {
    fetchLatestOrganizationUserId {
      email
      fullName
      userId
    }
  }
`;

