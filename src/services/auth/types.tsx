import {
  ActionFunctionMap,
  AnyEventObject,
  State,
  StateMachine,
  ActorRefFrom,
} from "xstate";
import { Context as KernelContext } from "../kernel/types";
import { Send } from "../shared-actions";
import { User } from "../../types";

export interface Context {
  kernel: KernelContext | undefined;
  user: User | null;
  authenticating: boolean;
  error: string | null;
  token: string;
}

export type Machine = StateMachine<Context, any, AnyEventObject>;
export type Ref = ActorRefFrom<Machine>;
export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
