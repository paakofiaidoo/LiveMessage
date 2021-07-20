import { SubscriptionClient } from "subscriptions-transport-ws";
import { Message } from "../../types";
import { createApolloClient } from "../../utils/apollo";
import { Send } from "../shared-actions";
import { MESSAGES, SEND_MESSAGE, SUBSCRIPTION } from "./graphql";
import { ChatContext, Context } from "./types";

export const findMessage = async (ctx: ChatContext) => {
  const client = createApolloClient();
  const variables = { sentTo: ctx.userId };
  const { data, error } = await client.query({ query: MESSAGES, variables });

  // Report Error
  if (error) throw Error("Oops! an error occured, please try again");

  return (data.messages as Message[]) || ([] as Message[]);
};

export const sendMessage = async (ctx: ChatContext) => {
  const client = createApolloClient();
  const {
    data: { sendMessage },
    errors,
  } = await client.mutate({
    mutation: SEND_MESSAGE,
    variables: {
      sendInput: {
        sentTo: ctx.userId,
        content: ctx.message.trim(),
        sentAt: new Date(),
      },
    },
  });

  // Report Error
  if (errors) throw Error("Oops! could not send message, please try again");

  return sendMessage as Message;
};

export const subscribe = (
  client: SubscriptionClient,
  userId: string,
  send: Send<Context>
) => {
  const observer = {
    next: (result: any) => {
      const sentMessage = result && result.data && result.data.sentMessage;
      if (sentMessage)
        send({ type: "CHAT.INCOMING_MESSAGE", data: sentMessage });
    },
    error: (e: any) => console.log("[Message] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client
    .request({ query: SUBSCRIPTION, variables: { userId } })
    .subscribe(observer);
};
