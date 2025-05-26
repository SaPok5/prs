import { gql } from "@apollo/client";


export const GET_WORKTYPES = gql`
query WorkTypes {
  workTypes {
    data {
      createdAt
      id
      name
      description
    }
  }
}
`

export const WORKTYPES =  gql`
query WorkTypes {
  workTypes {
    data {
      name
    }
  }
}
`




export const ADD_WORK_TYPE = gql`
  mutation AddWorkType($input: WorkTypeInput) {
    addWorkType(input: $input) {
      status {
        success
        message
      }
      data {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_WORK_TYPE = gql`
mutation UpdateWorkType($workTypeId: ID!, $input: WorkTypeInput!) {
  updateWorkType(workTypeId: $workTypeId, input: $input) {
    status {
      success
      message
    }
    data {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
}
`;

export const DELETE_WORK_TYPE = gql`
 mutation DeleteWorkType($workTypeId: ID!) {
  deleteWorkType(workTypeId: $workTypeId) {
    data {
      createdAt
      description
      id
      name
    }
    status {
      message
      success
    }
  }
}
`;

