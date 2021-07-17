import { createMachine } from "xstate";
import { ContextMessage } from "../service-message";
import { actions } from "./actions";
import { findUsers, blockUser } from "./network-actions";
import { Context } from "./types";

export const initialContext: Context = {
  users: {},
  userFetchError: null,
  userBlockError: null,
};

export const machine = createMachine<Context>(
  {
    id: "user",
    context: initialContext,
    type: "parallel",
    states: {
      fetch: {
        initial: "idle",
        states: {
          idle: { on: { FetchUsers: "fetching" } },
          fetching: {
            id: "getUsers",
            invoke: {
              src: findUsers,
              onDone: {
                target: "idle",
                actions: ["updateUsers", "persist"],
              },
              onError: {
                target: "rejected",
                actions: ["updateError", "persist"],
              },
            },
          },
          rejected: { on: { FetchUsers: { target: "fetching" } } },
        },
      },
      blockUser: {
        initial: "idle",
        states: {
          idle: { on: { BlockUser: "blocking" } },
          blocking: {
            id: "blockUser",
            invoke: {
              src: blockUser,
              onDone: {
                target: "idle",
                actions: ["removeUser", "persist"],
              },
              onError: {
                target: "rejected",
                actions: ["updateBlockError", "persist"],
              },
            },
          },
          rejected: { on: { BlockUser: { target: "blocking" } } },
        },
      },
    },

    on: {
      [ContextMessage.LoadContext]: { actions: "loadContext" },
      UserOnline: { actions: ["setToOnline", "persist"] },
      UserOffline: { actions: ["setToOffline", "persist"] },
      UserBlocked: { actions: ["removeUser", "persist"] },
    },
  },
  { actions }
);
