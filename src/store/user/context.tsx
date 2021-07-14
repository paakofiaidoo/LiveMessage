import { useMachine } from "@xstate/react";
import { useAuthContext } from "../auth";
import { UserContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine, initialContext } from "./machine";
import {
  subscribeToUserOffline,
  subscribeToUserOnline,
} from "./network-actions";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import { ContextMessage } from "../service-message";
import { useAppContext } from "../context";

// User Context
const defaultContext: UserContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useUserContext = () => useContext(context);
export const UserProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [authState] = useAuthContext();
  const { websocketClient } = useAppContext();

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Subscription
  // useEffect(() => {
  //   if (authState.context.user) {
  //     subscribeToUserOnline(send);
  //     subscribeToUserOffline(send);
  //   }
  // }, [authState.context.user]);

  useEffect(() => {
    if (websocketClient) {
      subscribeToUserOnline(websocketClient, send);
      subscribeToUserOffline(websocketClient, send);
    }
  }, [websocketClient]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
