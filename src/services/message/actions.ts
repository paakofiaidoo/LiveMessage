import { assign, sendParent } from "xstate";
import { MessageAction } from "./types";

export const actions: MessageAction = {
  /* Send Actions */
  updateSendError: assign({ sendError: (_, e) => e.data }),
  attachSentMessage: assign({
    id: (_, e) => e.data.id,
    // sentBy: (_, e) => e.data.sentBy.id,
    // sentTo: (_, e) => e.data.sentTo.id,
    isSent: (_, e) => true,
    sendError: (_, e) => null,
  }),

  /* General */
  commit: sendParent((context) => ({
    type: "MESSAGE.COMMIT",
    message: context,
  })),
};
