import { createMachine } from "xstate";
import { AuthMessage, ContextMessage } from "../service-message";
import { actions } from "./actions";
import { login } from "./network-actions";
import { Context } from "./types";

export const initialContext: Context = {
  kernel: undefined,
  authenticating: false,
  user: null,
  error: null,
  token: "",
};

export const createAuthMachine = () =>
  createMachine<Context>(
    {
      id: "auth",
      context: initialContext,
      initial: "idle",
      states: {
        idle: {
          on: { [AuthMessage.Login]: "login" },
        },
        login: {
          id: "loginUser",
          onEntry: ["updateToken", "updateToggleAuthenticating"],
          invoke: {
            src: login,
            onDone: {
              target: "idle",
              actions: ["updateUser", "updateToggleAuthenticating", "persist"],
            },
            onError: {
              target: "rejected",
              actions: ["updateError", "updateToggleAuthenticating", "persist"],
            },
          },
        },
        rejected: {
          on: { [AuthMessage.Login]: { target: "login" } },
        },
      },

      on: {
        /* Kernel Events */
        UPDATE: { actions: ["updateKernel"] },

        /* Store Events */
        [ContextMessage.LoadContext]: { actions: "loadContext" },

        /* Auth Events */
        [AuthMessage.Logout]: { target: "idle", actions: ["logout"] },
      },
    },
    { actions }
  );

export const initialMachine = createAuthMachine();
