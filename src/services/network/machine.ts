import { createMachine } from "xstate";
import { createSend } from "../shared-actions";
import { actions } from "./actions";
import { Context, NetworkActor } from "./types";

export const initialContext: Context = {
  kernel: undefined,
  ws: undefined,
};

export const createNetworkMachine = () =>
  createMachine<Context>(
    {
      id: "network",
      context: initialContext,
      on: {
        /* Kernel Events */
        UPDATE: { actions: ["updateKernel"] },

        /* Network Events */
        ConnectWebSocket: { actions: "createWebSocket" },
        DisconnectWebSocket: { actions: "removeWebSocket" },
      },
    },
    { actions }
  );

export const initialMachine = createNetworkMachine();
export const initialNetworkActor: NetworkActor = [
  initialMachine.initialState,
  createSend(initialMachine.initialState.context),
];
