import { SubscriptionClient } from "subscriptions-transport-ws";
import { User } from "../../types";
import { createApolloClient } from "../../utils/apollo";
import { Send } from "../shared-actions";
import {
  USERS,
  USER_OFFLINE_SUB,
  USER_ONLINE_SUB,
  BLOCK_USER,
  USER_BLOCKED,
} from "./graphql";
import { Context, UserCollection } from "./types";

export const findUsers = async () => {
  try {
    const { data, error } = await createApolloClient().query({ query: USERS });

    // Report error
    if (error) throw Error(error.message);

    // Convert to User
    const collection: UserCollection = data.users.reduce(
      (acc: UserCollection, cur: User) => ({ ...acc, [cur.id]: cur }),
      {} as UserCollection
    );

    return collection;
  } catch (e) {
    throw e;
  }
};

export const blockUser = async (_: any, e: any) => {
  try {
    const { data, errors } = await createApolloClient().mutate({
      mutation: BLOCK_USER,
      variables: { id: e.id },
    });

    // Report error
    if (errors) throw Error("Failed to block user");

    return data.blockUser.blockedUser;
  } catch (e) {
    throw e;
  }
};

/* Subscription */
export const subscribeToUserOnline = (
  client: SubscriptionClient,
  send: Send<Context>
) => {
  const observer = {
    next: (result: any) => {
      const userOnline = result && result.data && result.data.userOnline;
      userOnline && send("UserOnline", { data: userOnline });
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
      userOffline && send("UserOffline", { data: userOffline });
    },
    error: (e: any) => console.log("[User] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client.request({ query: USER_OFFLINE_SUB }).subscribe(observer);
};

export const subscribeToUserBlocked = (
  client: SubscriptionClient,
  appUserId: string,
  send: Send<Context>
) => {
  const observer = {
    next: (result: any) => {
      const userBlocked = result && result.data && result.data.userBlocked;

      userBlocked && send("UserBlocked", { data: userBlocked.blockedBy });
    },
    error: (e: any) => console.log("[User] Bad Sub: ", e),
    complete: () => console.log("Complete Sub"),
  };

  return client
    .request({ query: USER_BLOCKED, variables: { id: appUserId } })
    .subscribe(observer);
};
