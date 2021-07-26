import { gql } from "@apollo/client";

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
