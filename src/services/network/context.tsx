import { useMachine } from "@xstate/react";
import { ContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine, initialContext } from "./machine";
import React, { createContext, FunctionComponent, useContext } from "react";

// Network Context
const defaultContext: ContextValue = [
  machine.initialState,
  createSend(initialContext),
];

export const context = createContext(defaultContext);
export const useNetworkContext = () => useContext(context);
export const NetworkProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
