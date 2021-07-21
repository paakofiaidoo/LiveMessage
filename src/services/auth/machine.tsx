import { createMachine } from "xstate";
import { AUTH_TOKEN_KEY } from "../../utils/apollo";
import { createSend } from "../shared-actions";
import { actions } from "./actions";
import { login } from "./network-actions";
import { AuthActor, Context } from "./types";
import jwt from "jsonwebtoken";
import { respond, send, sendParent } from "xstate/lib/actions";

export const initialContext: Context = {
  kernel: undefined,
  authenticating: false,
  user: null,
  error: null,
  token: "",
};

const statusMachine = createMachine({
  id: "authStatus",
  initial: "waiting",
  states: {
    waiting: {
      on: {
        CHECK: {
          actions: respond(() => {
            const good = { type: "GOOD_AUTH" };
            const bad = { type: "LOGOUT" };

            // Checking Login
            if (!localStorage) return bad;

            const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
            const decoded: any = jwt.decode(token);

            // Check expiration
            if (!decoded || !decoded.exp || Date.now() > decoded.exp * 1000) {
              return bad;
            }

            return good;
          }),
        },
      },
    },
  },
});

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
            idle: {
              on: { LOGIN: "login" },
            },
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
                    send({ type: "GOOD_AUTH" }),
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
          initial: "checking",
          states: {
            checking: {
              id: "checking",
              invoke: { id: "statusMachine", src: statusMachine },
              entry: send("CHECK", { to: "statusMachine", delay: 2000 }),
              on: { GOOD_AUTH: "checking" },
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
    { actions }
  );

export const initialMachine = createAuthMachine();
export const initialAuthActor: AuthActor = [
  initialMachine.initialState,
  createSend(initialMachine.initialState.context),
];
