import { useActor, useMachine } from "@xstate/react";
import { ContextValue } from "./types";
import { createSend } from "../shared-actions";
import { machine } from "./machine";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";

// User Context
const defaultContext: ContextValue = [
  machine.initialState,
  createSend(machine.initialState.context),
];

export const context = createContext(defaultContext);
export const useCoreContext = () => useContext(context);
export const CoreProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);
  const [_, sendChat] = useActor(state.context.chat);

  useEffect(() => {
    sendChat("RUN_UPDATE");
  }, []);

  return <context.Provider value={[state, send]}>{children}</context.Provider>;
};
