import { createMachine } from "xstate";
import { actions } from "./actions";
import { Context } from "./types";

export const initialContext: Context = {
  kernel: undefined,
  ws: undefined,
};

export const createNetworkMachine = () =>
  createMachine<Context>(
    {
      id: "user",
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
