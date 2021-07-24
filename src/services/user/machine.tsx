import { createMachine } from "xstate";
import { createSend } from "../shared-actions";
import { actions } from "./actions";
import { findUsers, blockUser } from "./network-actions";
import { Context, UserActor } from "./types";

export const initialContext: Context = {
  kernel: undefined,
  isOpen: false,
  users: {},
  userFetchError: null,
  userBlockError: null,
};

export const createUserMachine = () =>
  createMachine<Context>(
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
            idle: { on: { BlockUser: { target: "blocking", cond: "hasId" } } },
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
        /* Kernel Events */
        UPDATE: { actions: ["updateKernel"] },

        /* Store Events */
        LOAD_CONTEXT: { actions: "loadContext" },

        /* User Events */
        UserOnline: { actions: ["setToOnline", "persist"] },
        UserOffline: { actions: ["setToOffline", "persist"] },
        UserBlocked: { actions: ["removeUser", "persist"] },
        TOGGLE: { actions: ["toggle", "persist"] },
        CLOSE_LIST: { actions: ["closeList", "persist"] },
        OPEN_LIST: { actions: ["openList", "persist"] },
      },
    },
    {
      actions,
      guards: { hasId: (_, { id }) => !!id },
    }
  );

export const initialMachine = createUserMachine();
export const initialUserActor: UserActor = [
  initialMachine.initialState,
  createSend(initialMachine.initialState.context),
];
