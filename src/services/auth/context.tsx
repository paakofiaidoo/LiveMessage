import { useMachine } from "@xstate/react";
import { ContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine, initialContext } from "./machine";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import { ContextMessage } from "../service-message";
import { useNetworkContext } from "../network";

const defaultContext: ContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useAuthContext = () => useContext(context);
export const AuthProvider: FunctionComponent = ({ children }) => {
  const [netState, netSend] = useNetworkContext();
  const [state, send] = useMachine(machine);
  const ws = netState.context.ws;

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Reconnecting Websocket
  useEffect(() => {
    if (!ws && state.context.user) netSend("ConnectWebSocket");
    if (ws && !state.context.user) netSend("DisconnectWebSocket");
  }, [state.context.user]);

  // Subscription

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
