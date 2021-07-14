import { assign } from "xstate";
import { createWebSocketClient } from "../../utils/apollo";
import { Action } from "./types";

export const actions: Action = {
  createWebSocket: assign({ ws: (_, __) => createWebSocketClient() }),
  removeWebSocket: assign({
    ws: (ctx, __) => {
      ctx.ws && ctx.ws.close();
      return undefined;
    },
  }),
};
