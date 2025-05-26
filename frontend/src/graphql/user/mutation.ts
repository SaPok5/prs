import { gql } from "@apollo/client";

export const CREATE_USER = gql`
mutation CreateUser($input: CreateUser) {
  createUser(input: $input) {
    data {
      email
      fullName
      team {
        teamName
      }
      id
      role {
        role {
          roleName
        }
      }
      userId
    }
    status {
      message
      success
      errors {
        field
        message
      }
    }
   
  }
}
`;
