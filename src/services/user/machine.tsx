import { createMachine } from "xstate";
import { ContextMessage } from "../service-message";
import { actions } from "./actions";
import { findUsers } from "./network-actions";
import { Context } from "./types";

export const initialContext: Context = {
  users: [],
  userFetchError: null,
  userList: {},
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
          idle: { on: { FETCH_USERS: "fetching" } },
          fetching: {
            id: "getUsers",
            invoke: {
              src: findUsers,
              onDone: {
                target: "fetchMore",
                actions: ["updateUsers", "persist"],
              },
              onError: {
                target: "rejected",
                actions: ["updateError", "persist"],
              },
            },
          },
          rejected: { on: { FETCH_USERS: { target: "fetching" } } },
          fetchMore: { on: { FETCH_USERS: { target: "fetching" } } },
        },
      },
    },

    on: {
      [ContextMessage.LoadContext]: { actions: "loadContext" },
      UserOnline: { actions: ["setToOnline"] },
      UserOffline: { actions: ["setToOffline"] },
    },
  },
  { actions }
);
