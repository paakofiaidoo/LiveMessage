import { assign } from "xstate";
import { createWebSocketClient } from "../../utils/apollo";
import { Action } from "./types";

export const actions: Action = {
  /* Kernel Actions */
  updateKernel: assign({
    kernel: (_, event) => {
      console.log("[Network]  Received Updated Kernel");

      return event.kernel;
    },
  }),

  /* Network Actions */
  createWebSocket: assign({ ws: (_, __) => createWebSocketClient() }),
  removeWebSocket: assign({
    ws: (ctx, __) => {
      ctx.ws && ctx.ws.close();
      return undefined;
    },
  }),
};
