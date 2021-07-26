import { assign, sendParent, spawn } from "xstate";
import { createMessageContext, createMessageMachine } from "../message/machine";
import { ChatAction } from "./types";

export const actions: ChatAction = {
  updateFetchError: assign({ fetchError: (_, e) => e.data }),
  updateMessage: assign({ message: (_, e) => e.value }),
  clearMessage: assign({ message: (_, e) => "" }),

  rehydateMessages: assign({
    messages: ({ messages }, _) =>
      messages.map((message) => ({
        ...message,
        ref: spawn(createMessageMachine(message)),
      })),
  }),

  updateMessages: assign({
    messages: (_, { data }: any) =>
      data.map((message: any) => {
        const msgContext = createMessageContext(
          message.content,
          message.sentBy.id,
          message.sentTo.id,
          message.id,
          message.sentAt
        );

        return {
          ...msgContext,
          ref: spawn(createMessageMachine(msgContext)),
        };
      }),
  }),

  createNewMessage: assign({
    messages: ({ message, userId, messages }, { sentBy }) => {
      const newMessage = createMessageContext(message, sentBy, userId);
      const machine = createMessageMachine(newMessage, { new: true });

      return [...messages, { ...newMessage, ref: spawn(machine) }];
    },
  }),

  attachIncomingMessage: assign({
    messages: ({ messages }, { data }) => {
      const msgContext = createMessageContext(
        data.content,
        data.sentBy.id,
        data.sentTo.id,
        data.id,
        data.sentAt
      );
      const machine = createMessageMachine(msgContext);

      return [...messages, { ...msgContext, ref: spawn(machine) }];
    },
  }),

  commitMessage: assign({
    messages: (context, event) =>
      context.messages.map((message) => {
        return message.id === event.message.id
          ? { ...message, ...event.message, ref: message.ref }
          : message;
      }),
  }),

  /* General */
  open: assign({ isOpen: (_) => true }),
  close: assign({ isOpen: (_) => false }),
  commit: sendParent((context) => ({ type: "CHAT.COMMIT", chat: context })),
  sendActive: sendParent(({ userId }) => ({ type: "CHAT.ACTIVE", userId })),
};
