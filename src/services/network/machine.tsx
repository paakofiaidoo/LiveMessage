import { createMachine } from "xstate";
import { actions } from "./actions";
import { Context } from "./types";

export const initialContext: Context = {
  ws: undefined,
};

export const machine = createMachine<Context>(
  {
    id: "user",
    context: initialContext,
    on: {
      ConnectWebSocket: { actions: "createWebSocket" },
      DisconnectWebSocket: { actions: "removeWebSocket" },
    },
  },
  { actions }
);
