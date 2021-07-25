import { createMachine } from "xstate";
import { createSend } from "../shared-actions";
import { actions } from "./actions";
import { ChatActor, Context } from "./types";

export const initialContext: Context = {
  kernel: undefined,
  chats: [],
  selected: null,
};

export const createChatMachine = () =>
  createMachine<Context>(
    {
      id: "chats",
      context: initialContext,
      on: {
        /* Kernel Events */
        UPDATE: { actions: ["updateKernel"] },

        /* Store Events */
        LOAD_CONTEXT: { actions: ["loadContext", "rehydateChats"] },

        /* Chat Events */
        "CHAT.ACTIVE": { actions: ["selectChat", "persist"] },
        "CHAT.COMMIT": { actions: ["commitChat", "persist"] },
        "CHAT.START": {
          actions: ["startChat", "openChat", "sendCloseUserList", "persist"],
          cond: "hasUserId",
        },
        "CHAT.INCOMING_MESSAGE": { actions: "sendMessage", cond: "hasData" },
        "CHAT.REMOVE": {
          actions: ["removeChat", "persist"],
          cond: "hasUserId",
        },
      },
    },
    {
      actions,
      guards: {
        hasData: (_, { data }) => !!data,
        hasUserId: (_, { userId }) => !!userId,
      },
    }
  );

export const initialMachine = createChatMachine();
export const initialChatActor: ChatActor = [
  initialMachine.initialState,
  createSend(initialMachine.initialState.context),
];
