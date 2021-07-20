import { assign, sendParent } from "xstate";
import { ChatAction } from "./types";

export const actions: ChatAction = {
  /* Fetch Actions */
  updateMessages: assign({ messages: (_, e) => e.data }),
  updateFetchError: assign({ fetchError: (_, e) => e.data }),

  /* Send Actions */
  updateMessage: assign({ message: (_, e) => e.value }),
  updateSendError: assign({ sendError: (_, e) => e.data }),
  clearMessage: assign({ message: (_, e) => "" }),
  attachIncomingMessage: assign({
    messages: (ctx, e) => [...ctx.messages, e.data],
  }),

  /* General */
  open: assign({ isOpen: (_) => true }),
  close: assign({ isOpen: (_) => false }),
  commit: sendParent((context) => ({ type: "CHAT.COMMIT", chat: context })),
  sendActive: sendParent(({ userId }) => ({ type: "CHAT.ACTIVE", userId })),
};
