import { gql } from "@apollo/client";

export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      blockedBy
      blockedUser
    }
  }
`;

export const USERS = gql`
  query Users($limit: Int, $skip: Int) {
    users(limit: $limit, skip: $skip) {
      id
      name
      email
      image
      status
      # blockedBy
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
      # blockedBy
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
      # blockedBy
    }
  }
`;

export const USER_BLOCKED = gql`
  subscription UserBlocked($id: ID!) {
    userBlocked(id: $id) {
      blockedBy
      blockedUser
    }
  }
`;
