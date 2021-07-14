import { assign } from "xstate";
import { AUTH_TOKEN_KEY } from "../../utils/apollo-old";
import { createLoadContext, createPersist } from "../shared-actions";
import { STORE_NAME } from "./constants";
import { initialContext } from "./machine";
import { Action } from "./types";

export const actions: Action = {
  updateToggleAuthenticating: assign({
    authenticating: (ctx) => !ctx.authenticating,
  }),
  updateUser: assign({ user: (_, e) => e.data }),
  updateToken: assign({ token: (_, e) => e.token }),
  updateError: assign({ error: (_, e) => e.data.message }),
  // logout: assign({
  //   token: (_, e) => "",
  //   user: (_, e) => {
  //     if (localStorage) localStorage.removeItem(AUTH_TOKEN_KEY);
  //     return null;
  //   },
  // }),
  logout: assign((c, e) => {
    if (localStorage) localStorage.clear();
    return initialContext;
  }),

  /* Context Actions */
  persist: createPersist(STORE_NAME),
  loadContext: createLoadContext(STORE_NAME),
};
