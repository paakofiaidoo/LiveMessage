import { createMachine } from "xstate";
import { ContextMessage, MessageMessage } from "../service-message";
import { actions } from "./actions";
import { findMessage, sendMessage } from "./network-actions";
import { Context } from "./types";

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
  { actions }
);
