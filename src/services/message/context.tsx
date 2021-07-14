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
import { useNetworkContext } from "../network";

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
  const [netState] = useNetworkContext();

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  useEffect(() => {
    // Subcribe for messages
    if (netState.context.ws && authState.context.user) {
      subscribe(netState.context.ws, authState.context.user.id, send);
    }
  }, [authState.context.user]);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
