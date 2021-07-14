import { gql } from "@apollo/client";
import { useMachine } from "@xstate/react";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import { createMachine, assign, State } from "xstate";
import { User } from "../../types";
import { createApolloClient } from "../../utils/apollo-old";
import { useAuthContext } from "../auth/auth-store";
import {
  createLoadContext,
  createPersist,
  createSend,
  Send,
} from "../shared-actions";

interface Context {
  users: User[];
  userFetchError: string | null;
}

// Contants
const STORE_NAME = "afrochat:user-store";

export const initialContext: Context = {
  users: [],
  userFetchError: null,
};

// Invoke Action
const USERS = gql`
  query Users($limit: Int, $skip: Int) {
    users(limit: $limit, skip: $skip) {
      id
      name
      email
      image
    }
  }
`;
const findUsers = async () => {
  try {
    const { data, error } = await createApolloClient().query({ query: USERS });

    // Report error
    if (error) throw Error(error.message);

    return data.users as User[];
  } catch (e) {
    throw e;
  }
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

    on: { LOAD_CONTEXT: { actions: "loadContext" } },
  },
  {
    actions: {
      updateUsers: assign({ users: (_, e) => e.data }),
      updateUserFetchError: assign({ userFetchError: (_, e) => e.data }),

      /* Context Actions */
      persist: createPersist(STORE_NAME),
      loadContext: createLoadContext(STORE_NAME),
    },
  }
);

/* UserOnline Subscription */
const USER_ONLINE_SUB = gql`
  subscription UserOnline {
    userOnline {
      id
      name
      email
      image
    }
  }
`;

const subscribeToUserOnline = (send: Send<Context>) => {
  const client = createApolloClient({ protocol: "websocket" });
  const observable = client.subscribe({ query: USER_ONLINE_SUB });

  observable.subscribe(
    // On Message
    ({ data: { userOnline } }) => {
      // send(MessageMessage.AttachMessage, { data: sentMessage });
      console.log("Incoming userOnline : ", userOnline);
    },

    // On Error
    (e) => console.log("Bad Sub: ", e),

    // On Complete
    () => console.log("Complete Sub")
  );
};

/* UserOnline Subscription */
const USER_OFFLINE_SUB = gql`
  subscription UserOffline {
    userOffline {
      id
      name
      email
      image
    }
  }
`;

const subscribeToUserOffline = (send: Send<Context>) => {
  const client = createApolloClient({ protocol: "websocket" });
  const observable = client.subscribe({ query: USER_OFFLINE_SUB });

  observable.subscribe(
    // On Message
    ({ data: { userOffline } }) => {
      // send(MessageMessage.AttachMessage, { data: sentMessage });
      console.log("Incoming userOffline: ", userOffline);
    },

    // On Error
    (e) => console.log("Bad Sub: ", e),

    // On Complete
    () => console.log("Complete Sub")
  );
};

// User Context
type UserContextValue = [State<Context>, Send<Context>];
const defaultContext: UserContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useUserContext = () => useContext(context);
export const UserProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [authState] = useAuthContext();

  // Subscription
  useEffect(() => {
    if (!authState.context.user) {
      subscribeToUserOnline(send);
      subscribeToUserOffline(send);
    }
  }, [authState.context.user]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
