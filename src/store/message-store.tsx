import React, {
  createContext,
  useContext,
  FunctionComponent,
  useEffect,
} from "react";
import { useMachine } from "@xstate/react";
import { gql } from "@apollo/client";
import { createMachine, assign, State } from "xstate";
import { createApolloClient } from "../utils/apollo";
import { Chat, Message } from "../types";
import {
  createLoadContext,
  createPersist,
  Send,
  createSend,
} from "./shared-actions";
import { ContextMessage, MessageMessage } from "./message";
import { useAuthContext } from "./auth-store";

interface Context {
  chats: Record<string, Chat>;
  selected: string;
  messages: Message[];
  message: string;

  // Errors
  fetchError: string | null;
  sendError: string | null;
}

// Contants
const STORE_NAME = "afrochat:message-store";

// Invoke Action
const SEND_MESSAGE = gql`
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

const MESSAGES = gql`
  query Messages($sentTo: String!, $limit: Int, $skip: Int) {
    messages(sentTo: $sentTo, limit: $limit, skip: $skip) {
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

const findMessage = async (ctx: Context) => {
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

const sendMessage = async (ctx: Context) => {
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

export const initialContext: Context = {
  chats: {},
  selected: "",
  messages: [],
  message: "",
  fetchError: null,
  sendError: null,
};

export const machine = createMachine<Context>(
  {
    id: "message",
    context: initialContext,
    type: "parallel",
    states: {
      /* Fetch Messages */
      fetch: {
        initial: "idle",
        states: {
          idle: { on: { [MessageMessage.Fetch]: "fetching" } },
          fetching: {
            id: "getMessage",
            invoke: {
              src: findMessage,
              onDone: {
                target: "fetchMore",
                actions: ["updateMessages", "updateChat", "persist"],
              },
              onError: {
                target: "rejected",
                actions: ["updateFetchError", "persist"],
              },
            },
          },
          rejected: { on: { [MessageMessage.Fetch]: { target: "fetching" } } },
          fetchMore: { on: { [MessageMessage.Fetch]: { target: "fetching" } } },
        },
      },

      /* Send Message */
      send: {
        initial: "idle",
        states: {
          idle: {
            on: {
              [MessageMessage.Send]: {
                target: "sending",
                cond: (ctx) => !!ctx.message && !!ctx.selected,
              },
            },
          },
          sending: {
            id: "sendMessage",
            invoke: {
              src: sendMessage,
              onDone: {
                target: "idle",
                actions: [
                  "attachSentMessage",
                  "clearMessage",
                  "updateChat",
                  "persist",
                ],
              },
              onError: {
                target: "sendError",
                actions: ["updateSendError", "persist"],
              },
            },
          },
          sendError: { on: { [MessageMessage.Send]: { target: "sending" } } },
        },
      },
    },

    on: {
      [ContextMessage.LoadContext]: { actions: "loadContext" },
      [MessageMessage.Select]: {
        target: "fetch.fetching",
        actions: ["setActiveChat", "updateChat", "persist"],
      },
      [MessageMessage.Typing]: {
        actions: ["updateMessage", "updateChat", "persist"],
      },
      [MessageMessage.AttachMessage]: {
        actions: ["attachSentMessage", "updateChat", "persist"],
      },
    },
  },
  {
    actions: {
      /* Fetch Actions */
      updateMessages: assign({ messages: (_, e) => e.data }),
      updateFetchError: assign({ fetchError: (_, e) => e.data }),
      updateChat: assign({
        chats: ({ chats, selected, messages, message }) => ({
          ...chats,
          [selected]: { with: selected, messages, message },
        }),
      }),
      setActiveChat: assign((ctx, e) => {
        const chat = ctx.chats[e.id] || {
          with: e.id,
          messages: [],
          message: "",
        };

        return {
          ...ctx,
          selected: chat.with,
          messages: chat.messages,
          message: chat.message,
        };
      }),

      /* Send Actions */
      updateMessage: assign({ message: (_, e) => e.message }),
      updateSendError: assign({ sendError: (_, e) => e.data }),
      clearMessage: assign({ message: (_, e) => "" }),
      attachSentMessage: assign({
        messages: (ctx, e) => [...ctx.messages, e.data],
      }),

      /* Context Actions */
      persist: createPersist(STORE_NAME),
      loadContext: createLoadContext(STORE_NAME),
    },
  }
);

// Message Context
type MessageContextValue = [State<Context>, Send<Context>];
const defaultContext: MessageContextValue = [
  machine.initialState,
  createSend(initialContext),
];

/* Subscription */

const SUBSCRIPTION = gql`
  subscription SentMessage($userId: ID!) {
    sentMessage(userId: $userId) {
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

const subscribe = (userId: string, send: Send<Context>) => {
  const client = createApolloClient({ protocol: "websocket" });
  const observable = client.subscribe({
    query: SUBSCRIPTION,
    variables: { userId },
  });

  observable.subscribe(
    // On Message
    ({ data: { sentMessage } }) => {
      send(MessageMessage.AttachMessage, { data: sentMessage });
    },

    // On Error
    (e) => console.log("Bad Sub: ", e),

    // On Complete
    () => console.log("Complete Sub")
  );
};

export const context = createContext(defaultContext);
export const useMessageContext = () => useContext(context);
export const MessageProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [
    {
      context: { user },
    },
  ] = useAuthContext();

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Subscriptions
  useEffect(() => {
    // Subcribe for messages
    if (user) subscribe(user.id, send);
  }, [user]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
