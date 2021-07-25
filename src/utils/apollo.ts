import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";

export const AUTH_TOKEN_KEY = `bm8za`;
const BASE_ADDRESS = `livemessage-server.herokuapp.com`;
// const BASE_ADDRESS = `localhost:4000`;
const URL = `https://${BASE_ADDRESS}`;
const WS_URL = `wss://${BASE_ADDRESS}/subscriptions`;

/** WebSocket Client */
export const createWebSocketClient = () => {
  return new SubscriptionClient(WS_URL, {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem(AUTH_TOKEN_KEY) || "",
    },
  });
};

/** Apollo HTTP Link */
const createHTTPLink = () => {
  return setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    // return the headers to the context so httpLink can read them
    return {
      headers: { ...headers, authorization: token ? `${token}` : "" },
    };
  }).concat(
    createHttpLink({
      uri: URL,
      credentials: "same-origin",
    })
  );
};

/** Apollo HTTP Client */
export const createApolloClient = () => {
  return new ApolloClient({
    link: createHTTPLink(),
    cache: new InMemoryCache(),
    ssrMode: typeof window === "undefined",
  });
};
