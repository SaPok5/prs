import { gql } from "@apollo/client";

// Login
export const USER_LOGIN = gql`
  mutation UserLogin($input: UserLoginInput) {
    userLogin(input: $input) {
      status {
        message
        success
      }
      token
      user {
        email
        fullName
        id
        team {
          teamId
          id
        }
      }
      role
    }
  }
`;

export const ORGANIZATION_LOGIN = gql`
  mutation OrganizationLogin($input: LoginInput) {
    organizationLogin(input: $input) {
      success
      message
      token
      role
      organization {
        email
        id
        organizationId
        organizationName
      }
    }
  }
`;

// Payment
export const ADD_PAYMENT = gql`
  mutation AddDealPayment(
    $paymentDate: Date
    $dealId: String
    $file: Upload
    $receivedAmount: Float
    $remarks: String
  ) {
    addDealPayment(
      paymentDate: $paymentDate
      dealId: $dealId
      file: $file
      receivedAmount: $receivedAmount
      remarks: $remarks
    ) {
      status {
        success
        message
      }
    }
  }
`;

// Client
export const ADD_CLIENTS = gql`
  mutation CreateClient($input: CreateClient) {
    createClient(input: $input) {
      status {
        message
        success
      }
    }
  }
`;

export const EDIT_CLIENT = gql`
  mutation EditClient($input: EditClientInput) {
    editClient(input: $input) {
      status {
        success
        message
      }
    }
  }
`;

//Deal
export const EDIT_DEAL = gql`
  mutation EditDeal($input: EditDealInput) {
    editDeal(input: $input) {
      status {
        success
        message
      }
      data {
      clientId
      createdAt
      dealDate
      dealId
      dealName
      dealValue
      dueDate
      id
      isEdited
      remarks
      sourceTypeId
      sourceType {
        id
        name
      }
      updatedAt
      client {
        id
        fullName
      }
      user {
        id
        fullName
      }
    }
    }
  }
`;

// payment
export const EDIT_PAYMENT_STATUS = gql`
  mutation VerifyPayment(
    $paymentStatus: String!
    $paymentId: String!
    $remarks: String
  ) {
    verifyPayment(
      paymentStatus: $paymentStatus
      paymentId: $paymentId
      remarks: $remarks
    ) {
      data {
        remarks
        paymentStatus
      }
      status {
        message
        success
      }
    }
  }
`;

export const Edit_OrgInfo_Status = gql`
  mutation EditOrganizationProfile($input: EditOrgProfileInput!) {
    editOrganizationProfile(input: $input) {
      organization {
        id
        organizationId
        organizationName
        email
        createdAt
      }
      status {
        success
        message
      }
    }
  }
`;

export const DELETE_TEAM_MUTATION = gql`
  mutation DeleteTeams($id: String!) {
    deleteTeams(id: $id) {
      status {
        success
        message
      }
    }
  }
`;

export const SWITCH_USER_TEAM = gql`
  mutation SwitchUserTeam($input: SwitchTeamInput) {
    switchUserTeam(input: $input) {
      status {
        success
        message
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

export const EDIT_PAYMENT = gql`
  mutation EditPayment(
    $editPaymentId: ID
    $paymentDate: Date
    $receivedAmount: Float
    $remarks: String
  ) {
    editPayment(
      id: $editPaymentId
      paymentDate: $paymentDate
      receivedAmount: $receivedAmount
      remarks: $remarks
    ) {
      data {
        paymentStatus
        receivedAmount
        remarks
      }
    }
  }
`;
