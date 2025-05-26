import { gql } from "@apollo/client";

export const REGISTER_ORG = gql`
  mutation RegisterOrganization($email: String, $password: String, $organizationName: String) {
  registerOrganization(email: $email, password: $password, organizationName: $organizationName) {
    message
    success
  }
}
`;


export const VERIFY_REGISTRATION_OTP =  gql`
  mutation VerifyOrganizationRegistrationOtp($input: VerifyOtpInput!) {
  verifyOrganizationRegistrationOtp(input: $input) {
    message
    success
  }
}
`