import { Message } from "../../types";
import { createApolloClient } from "../../utils/apollo";
import { SEND_MESSAGE } from "./graphql";
import { MessageContext } from "./types";

export const sendMessage = async (ctx: MessageContext) => {
  const client = createApolloClient();
  const {
    data: { sendMessage },
    errors,
  } = await client.mutate({
    mutation: SEND_MESSAGE,
    variables: {
      sendInput: {
        sentTo: ctx.sentTo,
        content: ctx.content.trim(),
        sentAt: ctx.sentAt,
      },
    },
  });

  // Report Error
  if (errors) throw Error("Oops! could not send message, please try again");

  return sendMessage as Message;
};
