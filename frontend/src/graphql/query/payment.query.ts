import { gql } from "@apollo/client";


export const GET_VERIFIER_DASHBOARD = gql`
query DisplayVerificationDashboard($input: DisplayVerificationDashboard) {
  displayVerificationDashboard(input: $input) {
    periodLabel
    dateRange {
      endDate
      startDate
    }
    verified {
      count
      total
    }
    denied {
      count
      total
    }
    pending {
      count
      total
    }
    payments {
      verified {
       id
        paymentDate
        receivedAmount
        receiptImage
        remarks
        denialRemarks
        paymentStatus
        editedAt
        createdAt
        updatedAt
        isEdited
      }
      denied {
        id
        paymentDate
        receivedAmount
        receiptImage
        remarks
        denialRemarks
        paymentStatus
        editedAt
        createdAt
        updatedAt
        isEdited
      }
      pending {
        id
        paymentDate
        receivedAmount
        receiptImage
        remarks
        denialRemarks
        paymentStatus
        editedAt
        createdAt
        updatedAt
        isEdited
      }
    }
  }
}
`