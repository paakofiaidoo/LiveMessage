import { assign } from "xstate";
import { createLoadContext, createPersist } from "../shared-actions";
import { STORE_NAME } from "./constants";
import { Action } from "./types";

export const actions: Action = {
  /* Fetch Actions */
  updateMessages: assign({ messages: (_, e) => e.data }),
  updateFetchError: assign({ fetchError: (_, e) => e.data }),
  updateChat: assign({
    chats: ({ chats, selected, messages, message }) => ({
      ...chats,
      [selected]: { with: selected, messages, message },
    }),
  }),
  setActiveChat: assign((ctx, e) => {
    const chat = ctx.chats[e.id] || {
      with: e.id,
      messages: [],
      message: "",
    };

    return {
      ...ctx,
      selected: chat.with,
      messages: chat.messages,
      message: chat.message,
    };
  }),

  /* Send Actions */
  updateMessage: assign({ message: (_, e) => e.message }),
  updateSendError: assign({ sendError: (_, e) => e.data }),
  clearMessage: assign({ message: (_, e) => "" }),
  attachSentMessage: assign({
    messages: (ctx, e) => [...ctx.messages, e.data],
  }),

  /* Context Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),
};
