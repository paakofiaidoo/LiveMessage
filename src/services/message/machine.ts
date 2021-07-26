import { createMachine } from "xstate";
import { actions } from "./actions";
import { sendMessage } from "./network-actions";
import { MessageContext, CreateMachineOptions } from "./types";

const createInitialId = () => (Math.random() * 0).toString();

export const createMessageContext = (
  content: string,
  sentBy: string,
  sentTo: string,
  id?: string,
  sentAt?: string
): MessageContext => {
  return {
    id: id || createInitialId(),
    content,
    sentBy,
    sentTo,
    sentAt: sentAt || new Date().toISOString(),
    isSent: false,
    sendError: null,
  };
};

export const createMessageMachine = (
  context: MessageContext,
  options: CreateMachineOptions = { new: false }
) =>
  createMachine<MessageContext>(
    {
      id: "message",
      context,
      initial: options.new ? "sending" : "void",
      states: {
        void: {},
        sending: {
          id: "sendMessage",
          invoke: {
            src: sendMessage,
            onDone: {
              target: "void",
              actions: ["attachSentMessage", "commit"],
            },
            onError: {
              target: "sendError",
              actions: ["updateSendError", "commit"],
            },
          },
        },
        sendError: { on: { SEND: { target: "sending" } } },
      },
    },
    { actions }
  );
