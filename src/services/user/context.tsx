import { useMachine } from "@xstate/react";
import { UserContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine, initialContext } from "./machine";
import {
  subscribeToUserBlocked,
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
import { useNetworkContext } from "../network";
import { useAuthContext } from "../auth";

// User Context
const defaultContext: UserContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useUserContext = () => useContext(context);
export const UserProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [netState] = useNetworkContext();
  const [authState] = useAuthContext();
  const appUser = authState.context.user;
  const ws = netState.context.ws;

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  useEffect(() => {
    if (ws) {
      subscribeToUserOnline(ws, send);
      subscribeToUserOffline(ws, send);
      appUser && subscribeToUserBlocked(ws, appUser.id, send);
    }
  }, [ws]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
