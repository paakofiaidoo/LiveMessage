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
      (acc: Record<string, User>, cur: any) => ({ ...acc, [cur.id]: cur }),
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
    next: (result: any) => {
      const userOnline = result && result.data && result.data.userOnline;
      userOnline && send("UserOnline", { user: userOnline });
    },
    error: (e: any) => console.log("[User] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client.request({ query: USER_ONLINE_SUB }).subscribe(observer);
};

export const subscribeToUserOffline = (
  client: SubscriptionClient,
  send: Send<Context>
) => {
  const observer = {
    next: (result: any) => {
      const userOffline = result && result.data && result.data.userOffline;
      userOffline && send("UserOffline", { user: userOffline });
    },
    error: (e: any) => console.log("[User] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client.request({ query: USER_OFFLINE_SUB }).subscribe(observer);
};
