import { createMachine, spawn } from "xstate";
import { assign } from "xstate/lib/actions";
import { initialMachine as chat } from "../chat/machine";
import { initialMachine as net } from "../network/machine";
import { initialMachine as user } from "../user/machine";
import { initialMachine as auth } from "../auth/machine";
import { actions } from "./actions";
import { Context } from "./types";

const createInitialContext = (): Context => {
  return {
    chat: spawn(chat),
    network: spawn(net),
    user: spawn(user),
    auth: spawn(auth),
  };
};

export const createKernelMachine = () =>
  createMachine<Context>(
    {
      id: "kernel",
      context: createInitialContext,
      initial: "loading",
      states: {
        loading: {
          id: "loadingServices",
          entry: assign(createInitialContext),
          exit: "sendUpdates",
          always: "ready",
        },
        ready: {},
      },
    },
    { actions }
  );

export const machine = createKernelMachine();
