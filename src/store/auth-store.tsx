import React, {
  createContext,
  useContext,
  FunctionComponent,
  useEffect,
} from "react";
import { gql } from "@apollo/client";
import { useMachine } from "@xstate/react";
import { createMachine, assign, State } from "xstate";
import jwt from "jsonwebtoken";
import { User } from "../types";
import { AUTH_TOKEN_KEY, createApolloClient } from "../utils/apollo";
import { AuthMessage, ContextMessage } from "./message";
import {
  createLoadContext,
  createPersist,
  createSend,
  Send,
} from "./shared-actions";

interface Context {
  user: User | null;
  authenticating: boolean;
  error: string | null;
  token: string;
}

// Contants
const STORE_NAME = "afrochat:auth-store";

// Invoke Action
const LOGIN = gql`
  mutation LoginWithGoogle($token: String!) {
    loginWithGoogle(token: $token) {
      accessToken
    }
  }
`;

const ME = gql`
  query Me {
    me {
      id
      name
      email
      image
    }
  }
`;

const login = async ({ token }: Context) => {
  try {
    const client = createApolloClient();
    const {
      data: { loginWithGoogle },
      errors,
    } = await client.mutate({
      mutation: LOGIN,
      variables: { token },
    });

    // Report Error
    if (errors) throw Error("Oops! an error occured, please try again");

    // Persit Token
    if (localStorage)
      localStorage.setItem(AUTH_TOKEN_KEY, loginWithGoogle.accessToken);

    // Decode token
    const decode: any = jwt.decode(loginWithGoogle.accessToken);

    // Report Error
    if (!decode) throw Error("Oops! an error occured, please try again");

    // Fetch user's profile
    const { data, error } = await createApolloClient().query({ query: ME });

    if (error)
      throw Error("Oops! could not get user profile, please try again");

    return data.me as User;
  } catch (e) {
    throw e;
  }
};

// Defaults
const initialContext: Context = {
  authenticating: false,
  user: null,
  error: null,
  token: "",
};

const machine = createMachine<Context>(
  {
    id: "auth",
    context: initialContext,
    initial: "idle",
    states: {
      idle: {
        on: {
          [AuthMessage.Login]: "login",
          [AuthMessage.Logout]: "logout",
        },
      },
      login: {
        id: "loginUser",
        onEntry: ["updateToken", "updateToggleAuthenticating"],
        invoke: {
          src: login,
          onDone: {
            target: "logout",
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
      logout: {
        on: {
          [AuthMessage.Logout]: {
            target: "idle",
            actions: ["logout", "persist"],
          },
        },
      },
    },

    on: { [ContextMessage.LoadContext]: { actions: "loadContext" } },
  },
  {
    actions: {
      /* Auth */
      updateToggleAuthenticating: assign({
        authenticating: (ctx) => !ctx.authenticating,
      }),
      updateUser: assign({ user: (_, e) => e.data }),
      updateToken: assign({ token: (_, e) => e.token }),
      updateError: assign({ error: (_, e) => e.data.message }),
      logout: assign({
        token: (_, e) => "",
        user: (_, e) => {
          if (localStorage) localStorage.removeItem(AUTH_TOKEN_KEY);
          return null;
        },
      }),

      /* Context Actions */
      persist: createPersist(STORE_NAME),
      loadContext: createLoadContext(STORE_NAME),
    },
  }
);

// Auth Context
type AuthContextValue = [State<Context>, Send<Context>];

const defaultContext: AuthContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useAuthContext = () => useContext(context);
export const AuthProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Subscription

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
