import { Action } from "./types";

export const actions: Action = {
  sendUpdates: (context) => {
    console.log("core: sending update: ", context);

    const event = { type: "UPDATE", kernel: context };
    context.chat.send(event);
    context.network.send(event);
    context.user.send(event);
    context.auth.send(event);
  },
};
