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
import { useAppContext } from "../context";

const defaultContext: ContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useAuthContext = () => useContext(context);
export const AuthProvider: FunctionComponent = ({ children }) => {
  const { websocketClient, sendWebSocket } = useAppContext();
  const [state, send] = useMachine(machine);

  // Loading Context
  useEffect(() => {
    send(ContextMessage.LoadContext);
  }, []);

  // Reconnecting Websocket
  useEffect(() => {
    if (!websocketClient && state.context.user) sendWebSocket("connect");
    if (websocketClient && !state.context.user) sendWebSocket("disconnect");
  }, [state.context.user]);

  // Subscription

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
