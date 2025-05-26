import { gql } from "@apollo/client";

export const GET_COMMISSION = gql`
query GetCommissions($date: String) {
  getCommissions(date: $date) {
    name
    totalSales
    currency
    commissionPercent
    rate
    bonus
    totalCommission
    totalReceivedAmount
    convertedAmount
    baseCurrency

  }
}
`