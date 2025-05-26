import { gql } from "@apollo/client";

export const CREATE_OFFER = gql`
  mutation CreateOffer($input: OfferInput) {
    createOffer(input: $input) {
      data {
        id
        target
        bonus
        offer
        remarks
        createdAt
        updatedAt
      }
      status {
        success
        message
      }
    }
  }
`;

export const ASSIGN_OFFER_TO_TEAM = gql`
  mutation AssignOfferToTeam($teamId: String, $offerId: String) {
    assignOfferToTeam(teamId: $teamId, offerId: $offerId) {
      message
      team
      success
    }
  }
`;
