import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LoginWithGoogle($token: String!) {
    loginWithGoogle(token: $token) {
      accessToken
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      image
    }
  }
`;
