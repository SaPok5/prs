import { gql } from "@apollo/client"
export const FETCH_CLIENTS = gql`
query fetchClients {
  clients {
    clientId
    fullName
    id
    createdAt
  }
}
`

export const GET_USER_CLIENT_DROPDOWN = gql`
query GetClients {
  getUserClient {
    id
    clientId
    fullName
  }
}
`