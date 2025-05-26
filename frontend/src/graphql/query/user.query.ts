import { gql } from "@apollo/client";

export const ALL_USERS = gql`

query GettAllUsers {
  gettAllUsers {
    fullName
    id
  }
}

`

export const GET_ALL_USER_EXCEPT_VERIFIER = gql`
query GetAllUserExceptVerifier($date: Date) {
  getAllUserExceptVerifier(date: $date) {
    id
    userId
    fullName
    email
    role
    team
    dealCount
    totalSales
  }
}
`