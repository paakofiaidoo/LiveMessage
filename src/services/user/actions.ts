import { assign } from "xstate";
import { createLoadContext, createPersist } from "../shared-actions";
import { STORE_NAME } from "./constants";
import { Action } from "./types";

export const actions: Action = {
  /* Kernel Actions */
  updateKernel: assign({
    kernel: (_, event) => {
      console.log("[User] Received Updated Kernel");

      return event.kernel;
    },
  }),

  /* Context Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),

  /* User */
  updateUsers: assign({
    users: (_, e: any) => e.data,
  }),
  removeUser: assign({
    users: ({ users, kernel }, e) => {
      if (users[e.data]) {
        // Send Remove Chat
        kernel && kernel.chat.send({ type: "CHAT.REMOVE", userId: e.data });

        // Delete User
        delete users[e.data];
      }

      return users;
    },
  }),
  setToOnline: assign({
    users: (ctx, e) => {
      if (e.data) ctx.users[e.data.id] = e.data;
      return ctx.users;
    },
  }),
  setToOffline: assign({
    users: (ctx, e) => {
      if (e.data) ctx.users[e.data.id] = e.data;
      return ctx.users;
    },
  }),
  updateUserFetchError: assign({ userFetchError: (_, e: any) => e.data }),
  updateBlockError: assign({ userBlockError: (_, e: any) => e.data }),
  toggle: assign({ isOpen: ({ isOpen }) => !isOpen }),
  closeList: assign({ isOpen: (_) => false }),
  openList: assign({ isOpen: (_) => true }),
};
