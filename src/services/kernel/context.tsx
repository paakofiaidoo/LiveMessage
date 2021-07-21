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
import {
  subscribeToUserBlocked,
  subscribeToUserOffline,
  subscribeToUserOnline,
  subscribeToIncomingMessage,
} from "../subscriptions";

import { initialChatActor } from "../chat/machine";
import { initialNetworkActor } from "../network/machine";
import { initialUserActor } from "../user/machine";
import { initialAuthActor } from "../auth/machine";

// User Context
const defaultContext: ContextValue = {
  services: {
    network: initialNetworkActor,
    auth: initialAuthActor,
    user: initialUserActor,
    chat: initialChatActor,
  },
  state: machine.initialState,
  send: createSend(machine.initialState.context),
};

export const context = createContext(defaultContext);
export const useKernelContext = () => useContext(context);
export const KernelProvider: FunctionComponent = ({ children }) => {
  const [state, send] = useMachine(machine);

  const auth = useActor(state.context.auth);
  const network = useActor(state.context.network);
  const user = useActor(state.context.user);
  const chat = useActor(state.context.chat);

  const [authState, sendAuth] = auth;
  const [networkState, sendNetwork] = network;
  const [_, sendUser] = user;
  const [__, sendChat] = chat;

  const appUser = authState.context.user;
  const ws = networkState.context.ws;

  // Loading Context
  useEffect(() => {
    if (state.value !== "ready") return;

    sendAuth("LOAD_CONTEXT");
    sendUser("LOAD_CONTEXT");
    sendChat("LOAD_CONTEXT");
  }, []);

  // Reconnecting Websocket
  useEffect(() => {
    if (!ws && appUser) sendNetwork("ConnectWebSocket");
    if (ws && !appUser) sendNetwork("DisconnectWebSocket");
  }, [appUser]);

  // Subscriptions
  useEffect(() => {
    if (ws) {
      subscribeToUserOnline(ws, sendUser);
      subscribeToUserOffline(ws, sendUser);
      appUser && subscribeToUserBlocked(ws, appUser.id, sendUser);
      ws && appUser && subscribeToIncomingMessage(ws, appUser.id, sendChat);
    }
  }, [ws]);

  const services = { auth, network, user, chat };

  return (
    <context.Provider value={{ services, state, send }}>
      {children}
    </context.Provider>
  );
};
