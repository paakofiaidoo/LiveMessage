import { assign } from "xstate";
import { createLoadContext, createPersist } from "../shared-actions";
import { STORE_NAME } from "./constants";
import { initialContext } from "./machine";
import { Action } from "./types";

export const actions: Action = {
  /* Kernel Actions */
  updateKernel: assign({
    kernel: (_, event) => {
      console.log("[Auth] Updating Kernel");
      return event.kernel;
    },
  }),

  /* Auth Actions */
  updateToggleAuthenticating: assign({
    authenticating: (ctx) => !ctx.authenticating,
  }),
  updateUser: assign({ user: (_, e) => e.data }),
  updateToken: assign({ token: (_, e) => e.token }),
  updateError: assign({ error: (_, e) => e.data.message }),
  logout: assign(({ kernel }) => {
    localStorage && localStorage.clear(); // Clean user storage
    return { ...initialContext, kernel };
  }),

  /* Context Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),
};
