import { createMachine } from "xstate";
import { AuthMessage, ContextMessage } from "../service-message";
import { actions } from "./actions";
import { login } from "./network-actions";
import { Context } from "./types";

export const initialContext: Context = {
  authenticating: false,
  user: null,
  error: null,
  token: "",
};

export const machine = createMachine<Context>(
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
      [ContextMessage.LoadContext]: { actions: "loadContext" },
      [AuthMessage.Logout]: { target: "idle", actions: ["logout"] },
    },
  },
  { actions }
);
