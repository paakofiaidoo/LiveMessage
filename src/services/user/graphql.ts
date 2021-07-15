import { gql } from "@apollo/client";

export const USERS = gql`
  query Users($limit: Int, $skip: Int) {
    users(limit: $limit, skip: $skip) {
      id
      name
      email
      image
      status
      blockList
    }
  }
`;

export const USER_ONLINE_SUB = gql`
  subscription UserOnline {
    userOnline {
      id
      name
      email
      image
      status
      blockList
    }
  }
`;

export const USER_OFFLINE_SUB = gql`
  subscription UserOffline {
    userOffline {
      id
      name
      email
      image
      status
      blockList
    }
  }
`;
