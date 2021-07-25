import { createMachine, send } from "xstate";
import { AUTH_TOKEN_KEY } from "../../utils/apollo";
import { createSend } from "../shared-actions";
import { actions } from "./actions";
import { login } from "./network-actions";
import { AuthActor, Context } from "./types";
import jwt from "jsonwebtoken";

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
      type: "parallel",
      states: {
        login: {
          id: "login",
          initial: "idle",
          states: {
            idle: { on: { LOGIN: "login" } },
            login: {
              id: "loginUser",
              onEntry: ["updateToken", "updateToggleAuthenticating"],
              invoke: {
                src: login,
                onDone: {
                  target: "idle",
                  actions: [
                    "updateUser",
                    "updateToggleAuthenticating",
                    "persist",
                    send({ type: "START_CHECK" }),
                  ],
                },
                onError: {
                  target: "rejected",
                  actions: [
                    "updateError",
                    "updateToggleAuthenticating",
                    "persist",
                  ],
                },
              },
            },
            rejected: {
              on: { LOGIN: { target: "login" } },
            },
          },
        },

        status: {
          id: "status",
          initial: "idle",
          states: {
            idle: {
              on: { START_CHECK: "checking" },
              entry: send("START_CHECK", { delay: 500 }),
            },
            checking: {
              on: { STOP_CHECK: "stopping" },
              activities: "checkStatus",
              entry: () => console.log("[auth:status] Starting..."),
            },
            stopping: {
              on: { START_CHECK: "checking" },
              entry: () => console.log("[auth:status] Stopping..."),
            },
          },
        },
      },

      on: {
        /* Kernel Events */
        UPDATE: { actions: ["updateKernel"] },

        /* Store Events */
        LOAD_CONTEXT: { actions: "loadContext" },

        /* Auth Events */
        LOGOUT: { actions: ["logout"] },
      },
    },
    {
      actions,
      activities: {
        checkStatus: ({ kernel }) => {
          const interval = setInterval(() => {
            console.log("[auth:status] Checking Status!");

            // Checking Login
            if (!localStorage || !kernel) return;

            const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
            const decoded: any = jwt.decode(token);

            // Check expiration
            if (!decoded || !decoded.exp || Date.now() > decoded.exp * 1000) {
              kernel.auth.send({ type: "STOP_CHECK" });
              kernel.auth.send({ type: "LOGOUT" });
            }
          }, 5000);

          () => clearInterval(interval);
        },
      },
    }
  );

export const initialMachine = createAuthMachine();
export const initialAuthActor: AuthActor = [
  initialMachine.initialState,
  createSend(initialMachine.initialState.context),
];
