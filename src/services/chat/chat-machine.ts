import { createMachine } from "xstate";
import { actions } from "./chat-actions";
import { findMessage, sendMessage } from "./network-actions";
import { ChatContext } from "./types";

export const createChatContext = (userId: string): ChatContext => {
  return {
    isOpen: false,
    userId,
    messages: [],
    message: "",
    fetchError: null,
    sendError: null,
  };
};

export const createChatMachine = (context: ChatContext) =>
  createMachine<ChatContext>(
    {
      id: "chat",
      context,
      type: "parallel",
      states: {
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

        /* Send Message */
        send: {
          initial: "idle",
          states: {
            idle: {
              on: {
                SEND: {
                  target: "sending",
                  cond: (ctx) => !!ctx.message && !!ctx.userId,
                },
              },
            },
            sending: {
              id: "sendMessage",
              invoke: {
                src: sendMessage,
                onDone: {
                  target: "idle",
                  actions: ["attachIncomingMessage", "clearMessage", "commit"],
                },
                onError: {
                  target: "sendError",
                  actions: ["updateSendError", "commit"],
                },
              },
            },
            sendError: { on: { SEND: { target: "sending" } } },
          },
        },
      },

      on: {
        CHANGE: { actions: ["updateMessage", "commit"] },
        SEND: { target: "send.sending", cond: (ctx) => !!ctx.message },
        CLOSE: { actions: ["close", "commit"] },
        OPEN: { actions: ["open", "commit"] },
        INCOMING_MESSAGE: { actions: ["attachIncomingMessage", "commit"] },
      },
    },
    { actions }
  );
