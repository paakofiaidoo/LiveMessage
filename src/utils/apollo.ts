import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

export const AUTH_TOKEN_KEY = `bm8za`;
const URL = `http://localhost:4000`;
const WS_URL = `ws://localhost:4000/subscriptions`;

const httpLink = createHttpLink({
  uri: URL,
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

/** Link for websocket */
const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem(AUTH_TOKEN_KEY) || "",
    },
  },
});

/** A split for http and websocket */
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

interface Options {
  protocol?: "http" | "websocket" | "split";
}

export const createApolloClient = (options: Options = { protocol: "http" }) => {
  let link = authLink.concat(httpLink);

  if (options.protocol === "split") link = splitLink;
  if (options.protocol === "websocket") link = wsLink;
  if (options.protocol === "http") link = authLink.concat(httpLink);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: typeof window === "undefined",
  });
};
