import { gql } from "@apollo/client";

export const SUBSCRIPTION = gql`
  subscription SentMessage($userId: ID!) {
    sentMessage(userId: $userId) {
      id
      content
      sentBy {
        id
        name
        email
        image
      }
      sentTo {
        id
        name
        email
        image
      }
      sentAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($sendInput: SendInput!) {
    sendMessage(input: $sendInput) {
      id
      content
      sentBy {
        id
        name
        email
        image
      }
      sentTo {
        id
        name
        email
        image
      }
      sentAt
    }
  }
`;

export const MESSAGES = gql`
  query Messages($sentTo: String!, $limit: Int, $skip: Int) {
    messages(sentTo: $sentTo, limit: $limit, skip: $skip) {
      id
      content
      sentBy {
        id
        name
        email
        image
      }
      sentTo {
        id
        name
        email
        image
      }
      sentAt
    }
  }
`;
