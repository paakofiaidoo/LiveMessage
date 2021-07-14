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

interface WebSocketOptions {
  connectionParams?: Record<string, any>;
}

interface SplitLinkOptions {
  websocket?: WebSocketOptions;
}

interface Options {
  protocol?: "http" | "websocket" | "split";
  websocket?: WebSocketOptions;
}

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

/** Link for websocket */
const createWebSocketLink = (options: WebSocketOptions = {}) => {
  const connParms = options.connectionParams || {};

  return new WebSocketLink({
    uri: WS_URL,
    options: {
      reconnect: true,
      connectionParams: {
        authorization: localStorage.getItem(AUTH_TOKEN_KEY) || "",
        ...connParms,
      },
    },
  });
};

/** A split for http and websocket */
const createSplitLink = (options: SplitLinkOptions = {}) => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    createWebSocketLink(options.websocket),
    createHTTPLink()
  );
};

export const createApolloClient = (options: Options = { protocol: "http" }) => {
  const { protocol, websocket } = options;
  let link;

  if (protocol === "split") link = createSplitLink({ websocket });
  if (protocol === "websocket") link = createWebSocketLink(websocket);
  if (protocol === "http") link = createHTTPLink();

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: typeof window === "undefined",
  });
};
