import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Message } from "../../types";
import { createApolloClient, createWebSocketClient } from "../../utils/apollo";
import { MessageMessage } from "../service-message";
import { Send } from "../shared-actions";
import { MESSAGES, SEND_MESSAGE, SUBSCRIPTION } from "./graphql";
import { Context } from "./types";

export const findMessage = async (ctx: Context) => {
  try {
    const client = createApolloClient();
    const {
      data: { messages },
      error,
    } = await client.query({
      query: MESSAGES,
      variables: { sentTo: ctx.selected },
    });

    // Report Error
    if (error) throw Error("Oops! an error occured, please try again");

    return (messages as Message[]) || ([] as Message[]);
  } catch (e) {
    throw e;
  }
};

export const sendMessage = async (ctx: Context) => {
  try {
    const client = createApolloClient();
    const {
      data: { sendMessage },
      errors,
    } = await client.mutate({
      mutation: SEND_MESSAGE,
      variables: {
        sendInput: {
          sentTo: ctx.selected,
          content: ctx.message,
          sentAt: new Date(),
        },
      },
    });

    // Report Error
    if (errors) throw Error("Oops! could not send message, please try again");

    return sendMessage as Message;
  } catch (e) {
    throw e;
  }
};

export const subscribe = (
  client: SubscriptionClient,
  userId: string,
  send: Send<Context>
) => {
  const observer = {
    next: (result: any) => {
      const sentMessage = result && result.data && result.data.sentMessage;
      sentMessage && send(MessageMessage.AttachMessage, { data: sentMessage });
    },
    error: (e: any) => console.log("[Message] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client
    .request({ query: SUBSCRIPTION, variables: { userId } })
    .subscribe(observer);
};
