import { useMachine } from "@xstate/react";
import { useAuthContext } from "../auth";
import { ContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine, initialContext } from "./machine";
import { subscribe } from "./network-actions";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import { ContextMessage } from "../service-message";
import { useAppContext } from "../context";

// User Context
const defaultContext: ContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useMessageContext = () => useContext(context);
export const MessageProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [authState] = useAuthContext();
  const { websocketClient } = useAppContext();

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Subscriptions
  // useEffect(() => {
  //   // Subcribe for messages
  //   if (authState.context.user) {
  //     subscribe(authState.context.user.id, send);
  //   }
  // }, [authState.context.user]);

  useEffect(() => {
    // Subcribe for messages
    if (websocketClient && authState.context.user) {
      subscribe(websocketClient, authState.context.user.id, send);
    }
  }, [authState.context.user]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
