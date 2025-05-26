import { gql } from '@apollo/client';


export const CREATE_DEAL = gql`
mutation CreateDeal($input: DealInput, $file: Upload) {
  createDeal(input: $input, file: $file) {
    status {
      message
      success
    }
    data {
      id
      dealId
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
        id
        paymentDate
        paymentStatus
        receiptImage
        receivedAmount
        remarks
      }
    }
  }
}
`