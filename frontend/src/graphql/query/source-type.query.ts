import { gql } from "@apollo/client";

export const GET_SOURCE_TYPE =  gql`
query SourceTypes {
  sourceTypes {
    status {
      message
      success
    }
    data {
      createdAt
      description
      id
      name
      updatedAt
    }
  }
}
`;


export const COMPARISION_DATA = gql`
  query GetSourceTypeComparisonSales {
    getSourceTypeComparisonSales {
      sourceTypeMonthComparison {
        dealCount {
          change
          current
          previous
        }
        dealValue {
          change
          current
          previous
        }
        id
        name
      }
    }
  }
`;

export const DELETE_SOURCE_TYPE = gql`
mutation DeleteSourceType($deleteSourceTypeId: ID!) {
  deleteSourceType(id: $deleteSourceTypeId) {
    data {
      createdAt
      description
      id
      name
      updatedAt
    }
    status {
      message
      success
    }
  }
}
`;

export const CREATE_SOURCE_TYPE = gql`
mutation AddSourceType($input: SourceTypeInput) {
  addSourceType(input: $input) {
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

  export const UPDATE_SOURCE_TYPE = gql`
  mutation UpdateSourceType($id: ID!, $input: SourceTypeInput!) {
  updateSourceType(id: $id, input: $input) {
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


export const SOURCE_TYPE_SALES_COMPARISION = gql`
query SourceTypeSalesComparision($input: SalesComparisonInput!) {
  sourceTypeSalesComparision(input: $input) {
    currentDeals
    currentTotal
    lastDeals
    lastTotal
    salesComparison
    sourceTypeName
  }
}
`