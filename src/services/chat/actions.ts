import { assign, spawn } from "xstate";
import { createLoadContext, createPersist } from "../shared-actions";
import { createChatContext, createChatMachine } from "./chat-machine";
import { STORE_NAME } from "./constants";
import { Action } from "./types";

export const actions: Action = {
  /* Store Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),

  /* Core Actions */
  updateKernel: assign({
    kernel: (_, event) => {
      console.log("[Chat] Received Updated Kernel");
      return event.kernel;
    },
  }),

  /* Chat Actions */
  rehydateChats: assign({
    chats: ({ chats }, _) =>
      chats.map((chat) => ({
        ...chat,
        ref: spawn(createChatMachine(chat)),
      })),
  }),

  commitChat: assign({
    chats: (context, event) =>
      context.chats.map((chat) => {
        return chat.userId === event.chat.userId
          ? { ...chat, ...event.chat, ref: chat.ref }
          : chat;
      }),
  }),

  startChat: assign({
    selected: (_, { userId }) => userId,
    chats: ({ chats }, { userId }) => {
      // Prevent duplicate
      if (chats.find((c) => c.userId === userId)) return chats;

      const chat = createChatContext(userId);
      const machine = createChatMachine(chat);

      return [{ ...chat, ref: spawn(machine) }, ...chats];
    },
  }),

  selectChat: assign({ selected: (_, { userId }) => userId }),
  removeChat: assign({
    chats: ({ chats }, { userId }) =>
      chats.filter((chat) => chat.userId !== userId),
  }),

  sendMessage: ({ chats }, e) => {
    chats.forEach((chat) => {
      if (chat.userId !== e.data.sentBy.id) return;
      chat.ref.send({ type: "INCOMING_MESSAGE", data: e.data });
    });
  },

  openChat: ({ chats }, { userId }) => {
    chats.forEach((chat) => {
      if (chat.userId !== userId) return;
      chat.ref.send({ type: "OPEN" });
    });
  },

  sendCloseUserList: ({ kernel }) => {
    kernel && kernel.user.send({ type: "CLOSE_LIST" });
  },
};
