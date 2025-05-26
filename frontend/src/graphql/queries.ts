import { gql } from "@apollo/client";

// dashboard

export const GET_PAYMENT_DETAILS = gql`
  query Payments {
    fetchLatestOrganizationDealId {
      payments {
        id
        paymentDate
        paymentStatus
        receivedAmount
        remarks
      }
    }
  }
`;

export const GET_PAYMENT_DETAILS_WITH_STATUS = gql`
  query DisplayPaymentWithStatus($paymentStatus: String) {
    displayPaymentWithStatus(paymentStatus: $paymentStatus) {
      createdAt
      deal {
        dealName
        client {
          fullName
        }
        dealId
      }
      id
      paymentDate
      paymentStatus
      receiptImage
      receivedAmount
      denialRemarks
      remarks
      updatedAt
    }
  }
`;

export const GET_TODAY_SALES = gql`
  query DisplayTotalSalesOfMonth($input: DisplayTotalSalesArgs) {
    displayTotalSalesOfMonth(input: $input) {
      summary {
        totalSalesDealValue
        totalPaid
        totalDue
        totalDeals
        pendingDeals
        fullyPaidDeals
        collectionPercentage
        selectedDatePaidAmount
        verifiedPaymentsCount
        verifiedPaymentsAmount
      }
      metrics {
        dailyAverageDealValue
        dailyAverageCollection
        peakSalesDay {
          date
          amount
        }
        peakCollectionDay {
          date
          amount
        }
      }
      periodLabel
      workTypeSales {
        name
        paymentPercentage
        fullyPaidDeals
        totalDeals
        averageDealValue
        pendingDeals
        totalSalesDealValue
      }
    }
  }
`;

export const GET_TOTAL_SALES = gql`
  query DisplayTotalSalesOfMonth($input: DisplayTotalSalesArgs) {
    displayTotalSalesOfMonth(input: $input) {
      summary {
        totalSalesDealValue
        totalPaid
        totalDue
        totalDeals
        pendingDeals
        fullyPaidDeals
        collectionPercentage
        selectedDatePaidAmount
        verifiedPaymentsCount
        verifiedPaymentsAmount
      }
      metrics {
        dailyAverageDealValue
        dailyAverageCollection
        peakSalesDay {
          date
          amount
        }
        peakCollectionDay {
          date
          amount
        }
      }
      periodLabel
      workTypeSales {
        name
        paymentPercentage
        fullyPaidDeals
        averageDealValue
        pendingDeals
        totalSalesDealValue
        totalDeals
      }
    }
  }
`;

// query DisplayTotalSalesOfMonth($input: DisplayTotalSalesArgs) {
//   displayTotalSalesOfMonth(input: $input) {
//     summary {
//       totalSales
//       totalPaid
//       totalDue
//       totalDeals
//       pendingDeals
//       fullyPaidDeals
//       collectionPercentage
//     }
//     periodEnd
//     periodStart
//     periodLabel
//   }
// }

// Deal Page

export const GET_USERS_DEALS = gql`
  query DealsOfUser(
    $userId: ID
    $filter: String
    $limit: Float
    $page: Float
    $searchTerm: String
  ) {
    dealsOfUser(
      userId: $userId
      filter: $filter
      limit: $limit
      page: $page
      searchTerm: $searchTerm
    ) {
      deals {
        totalCount
        totalPages
        deals {
          id
          dealId
          dealName
          clientId
          dealValue
          dealDate
          dueDate
          remarks
          createdAt
          updatedAt
          isEdited
          verifiedPayment
          duesAmount
          payments {
            createdAt
            editedAt
            id
            paymentDate
            paymentStatus
            receiptImage
            receivedAmount
            remarks
            isEdited
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
          sourceTypeId
          workTypeId
          sourceType {
            id
            name
          }
          workType {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_DEAL_DETAILS = gql`
  query DealsDetail($dealId: String!) {
    getDealDetailsById(dealId: $dealId) {
      dealsDetail {
        dealId
        dealName
        workType
        sourceType
        dealDate
        dueDate
        dealValue
        remarks
        createdAt
        payments {
          id
          paymentDate
          receivedAmount
          receiptImage
          remarks
          paymentStatus
          editedAt
          createdAt
        }
        client {
          fullName
        }

        workTypedata {
          name
        }
        sourceTypedata {
          name
        }
      }
    }
  }
`;

// Client Page

export const GET_CLIENTS = gql`
  query GetClients {
    getClients {
      status {
        message
        success
      }
      clients {
        id
        clientId
        fullName
        email
        nationality
        contact
        createdAt
        updatedAt
      }
    }
  }
`;

export const CLIENTS = gql`
  query Clients($page: Float, $limit: Float, $searchTerm: String) {
    clients(page: $page, limit: $limit, searchTerm: $searchTerm) {
      totalCount
      totalPages
      clients {
        id
        clientId
        fullName
        email
        nationality
        contact
        createdAt
        updatedAt
        isEdited
      }
    }
  }
`;

export const GET_CLIENTS_BY_ID = gql`
  query GetClientById($clientId: String!) {
    getClientById(clientId: $clientId) {
      clients {
        id
        clientId
        fullName
        email
        nationality
        contact
        createdAt
        updatedAt
        deal {
          id
          dealId
          dealName

          workType {
            name
          }
          sourceType {
            name
          }
          dealValue
          dealDate
          dueDate
          remarks
          createdAt
          updatedAt
        }
      }
      status {
        message
        success
      }
    }
  }
`;

//payment
export const GET_PAYMENTS = gql`
  query DisplayPaymentWithStatus($paymentStatus: String) {
    displayPaymentWithStatus(paymentStatus: $paymentStatus) {
      id
      paymentDate
      receivedAmount
      receiptImage
      remarks
      paymentStatus
      editedAt
      createdAt
      updatedAt
      isEdited
      deal {
        dealId
        dealName
        client {
          fullName
        }
      }
    }
  }
`;

//user Profile
export const GET_USER_PROFILE = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      status {
        message
        success
      }
      data {
        userId
        fullName
        email
        id
        role {
          role {
            roleName
          }
        }
        team {
          teamName
        }
      }
    }
  }
`;

export const DISPLAY_ROLES = gql`
  query Roles {
    displayAllRolesOfOrganization {
      roles {
        id
        roleName
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const ALL_TEAMS_QUERY = gql`
  query AllTeams {
    allTeams {
      id
      name
      teamId
      teamName
      organizationId
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GettAllUsers {
    gettAllUsers {
      id
      userId
      fullName
      email
      role {
        role {
          roleName
        }
      }
      team {
        teamName
      }
    }
  }
`;

export const GET_ALL_TEAMS = gql`
  query AllTeams {
    allTeams {
      id
      teamId
      teamName
    }
  }
`;

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrgById($orgId: String!) {
    getOrgById(orgId: $orgId) {
      status {
        success
        message
      }
      organization {
        organizationName
        email
        createdAt
      }
    }
  }
`;

export const FETCH_LATEST_ORG_CLIENT_ID = gql`
  query {
    fetchLatestOrganizationClientId {
      id
      clientId
    }
  }
`;
export const DELETE_PAYMENT = gql`
  mutation DeletePayment($deletePaymentId: String!) {
    deletePayment(id: $deletePaymentId) {
      status {
        message
        success
      }
    }
  }
`;

export const FilterPaymentsByDateRange = gql`
  query FilterPaymentsByDateRange(
    $dateRange: String!
    $paymentStatus: String!
    $page: Float
    $limit: Float
    $searchQuery: String
  ) {
    filterPaymentsByDateRange(
      dateRange: $dateRange
      paymentStatus: $paymentStatus
      page: $page
      limit: $limit
      searchQuery: $searchQuery
    ) {
      payments {
        deal {
          dealId
          dealName
          client {
            fullName
          }
        }
        paymentDate
        receivedAmount
        receiptImage
        remarks
        paymentStatus
        denialRemarks
      }
      totalCount
      totalPages
    }
  }
`;
