import { gql } from "@apollo/client";

export const SAVE_COMMISSION = gql`
 mutation SaveCommission($input: [CommissionInput], $commissionDate: Date, $baseCurrency: String) {
    saveCommission(input: $input, commissionDate: $commissionDate, baseCurrency: $baseCurrency,) {
      message
      success
    }
  }
`;

export const UPDATE_COMMISSION = gql`
  mutation SaveCommission($input: [CommissionInput]) {
    saveCommission(input: $input) {
      message
      success
    }
  }
`;
