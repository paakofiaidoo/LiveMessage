import { createMachine } from "xstate";
import { actions } from "./chat-actions";
import { findMessage } from "./network-actions";
import { ChatContext } from "./types";

export const createChatContext = (userId: string): ChatContext => {
  return {
    isOpen: false,
    userId,
    messages: [],
    message: "",
    fetchError: null,
  };
};

export const createChatMachine = (context: ChatContext) =>
  createMachine<ChatContext>(
    {
      id: "chat",
      context,
      type: "parallel",
      states: {
        /* Hydrate Messages */
        hydrate: {
          id: "hydrateMessages",
          initial: "hydrating",
          states: {
            hydrating: {
              entry: "rehydateMessages",
              always: "rehydated",
            },
            rehydated: {},
          },
        },

        /* Fetch Messages */
        fetch: {
          initial: "idle",
          states: {
            idle: { on: { FETCH: "fetching" } },
            fetching: {
              id: "fetchMessages",
              invoke: {
                src: findMessage,
                onDone: {
                  target: "idle",
                  actions: ["updateMessages", "commit"],
                },
                onError: {
                  target: "rejected",
                  actions: ["updateFetchError", "commit"],
                },
              },
            },
            rejected: {
              on: { FETCH: { target: "fetching" } },
            },
          },
        },
      },

      on: {
        "MESSAGE.COMMIT": { actions: ["commitMessage", "commit"] },
        CHANGE: { actions: ["updateMessage", "commit"] },
        SEND: {
          actions: ["createNewMessage", "clearMessage", "commit"],
          cond: (ctx) => !!ctx.message,
        },
        CLOSE: { actions: ["close", "commit"] },
        OPEN: { actions: ["open", "commit"] },
        INCOMING_MESSAGE: { actions: ["attachIncomingMessage", "commit"] },
      },
    },
    { actions }
  );
