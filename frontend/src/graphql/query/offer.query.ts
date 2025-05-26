import { gql } from "@apollo/client";

export const GET_OFFERS = gql`
 query GetOffers {
  getOffers {
    id
    target
    bonus
    offer
    remarks
    createdAt
    updatedAt
    OfferAssign {
      team {
        teamName
      }
    }
  }
}
`;


export const OFFER_TARGET_MEET = gql`
  query GetOfferMeetTargetByTeam($offerId: String) {
  getOfferMeetTargetByTeam(offerId: $offerId) {
    totalSales
  }
}
`;

export const UPDATE_OFFER = gql`
mutation EditOffer($input: EditOfferInput) {
  editOffer(input: $input) {
    data {
      bonus
      id
      remarks
      offer
      target
      updatedAt
    }
    status {
      message
      success
    }
  }
}
  `;