import { useMachine } from "@xstate/react";
import { ContextValue } from "./types";
import { createSend } from "../shared-actions";
import { initialMachine, initialContext } from "./machine";
import React, { createContext, FunctionComponent, useContext } from "react";

// Network Context
const defaultContext: ContextValue = [
  initialMachine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useNetworkContext = () => useContext(context);
export const NetworkProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(initialMachine);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
