import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { User } from "../../types";
import { createApolloClient } from "../../utils/apollo";
import { Send } from "../shared-actions";
import { USERS, USER_OFFLINE_SUB, USER_ONLINE_SUB } from "./graphql";
import { Context } from "./types";

export const findUsers = async () => {
  try {
    const { data, error } = await createApolloClient().query({ query: USERS });

    // Report error
    if (error) throw Error(error.message);

    // Convert to User
    const users: Record<string, User> = data.users.reduce(
      (acc: Record<string, User>, cur: any) => ({
        ...acc,
        [cur.id]: {
          id: cur.id,
          name: cur.name,
          email: cur.email,
          image: cur.image,
          status: "Offline",
        },
      }),
      {}
    );

    return users;
  } catch (e) {
    throw e;
  }
};

export const subscribeToUserOnline = (
  client: SubscriptionClient,
  send: Send<Context>
) => {
  const observer = {
    // next: ({ data: { userOnline } }: any) => {
    next: (data: any) => {
      console.log("Online: ", data);
      // send("UserOnline", { data: userOnline });
    },
    error: (e: any) => console.log("[Message] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client.request({ query: USER_ONLINE_SUB }).subscribe(observer);

  // const observable = client.subscribe({ query: USER_ONLINE_SUB });

  // observable.subscribe(
  //   // On Message
  //   ({ data: { userOnline } }) => send("UserOnline", { user: userOnline }),

  //   // On Error
  //   (e) => console.log("Bad Sub: ", e),

  //   // On Complete
  //   () => console.log("Complete Sub")
  // );
};

export const subscribeToUserOffline = (
  client: SubscriptionClient,
  send: Send<Context>
) => {
  const observer = {
    // next: ({ data: { userOffline } }: any) => {
    next: (data: any) => {
      console.log("Offline: ", data);

      // send("UserOnline", { data: userOffline });
    },
    error: (e: any) => console.log("[Message] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client.request({ query: USER_OFFLINE_SUB }).subscribe(observer);
  // const observable = client.subscribe({ query: USER_OFFLINE_SUB });

  // observable.subscribe(
  //   // On Message
  //   ({ data: { userOffline } }) => {
  //     send("UserOffline", { user: userOffline });
  //     console.log("Incoming userOffline: ", userOffline);
  //   },

  //   // On Error
  //   (e) => console.log("Bad Sub: ", e),

  //   // On Complete
  //   () => console.log("Complete Sub")
  // );
};
