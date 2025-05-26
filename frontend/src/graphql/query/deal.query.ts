import { gql } from '@apollo/client';

export const getAllActiveCourseCard = gql`
  query GetAllActiveCourse {
    getAllActiveCourse {
      id
      courseTitle
      courseDescription
      mentor
      duration
      courseImage
      price
      ratings 
      isActive
    }
  }
`;


export const FetchLatestOrganizationDealId = gql`
query FetchLatestOrganizationDealId {
  fetchLatestOrganizationDealId {
    dealId
  }
}
`


export const GET_DEALS_BY_ADMIN = gql`

query DealsOfUser($userId: ID, $filter: String) {
  dealsOfUser(userId: $userId, filter: $filter) {
    deals {
      id
      dealId
      dealName
      clientId
      workType
      sourceType
      dealValue
      dealDate
      dueDate
      remarks
      createdAt
      updatedAt
      payments {
        createdAt
        editedAt
        id
        paymentDate
        paymentStatus
        receiptImage
        receivedAmount
        remarks
        updatedAt
        verifierId
        verifier {
          email
          fullName
          id
          userId
        }
      }
      client {
        fullName
      }
      user {
        fullName
        id
      }
    }
   
  }
}

`


export const DELETE_DEAL = gql`
mutation DeleteDeal($dealId: String) {
  deleteDeal(dealId: $dealId) {
    message
    success
  }
}
`