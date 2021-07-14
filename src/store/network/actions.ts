import { assign } from "xstate";
import { createLoadContext, createPersist } from "../shared-actions";
import { STORE_NAME } from "./constants";
import { Action } from "./types";

export const actions: Action = {
  /* Context Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),

  updateUsers: assign({ userList: (_, e: any) => e.data }),
  updateUserFetchError: assign({ userFetchError: (_, e: any) => e.data }),
  setToOnline: assign({
    userList: ({ userList }, e) => {
      console.log("Online: ", e.user);

      const user = userList[e.user.id] || e.user;
      user.status = "Online";
      return { ...userList, [user.id]: user };
    },
  }),
  setToOffline: assign({
    userList: ({ userList }, e) => {
      const user = userList[e.user.id] || e.user;
      user.status = "Offline";
      return { ...userList, [user.id]: user };
    },
  }),
};
