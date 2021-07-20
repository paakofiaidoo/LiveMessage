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

export type UserCollection = Record<string, User>;

export interface Context {
  kernel: KernelContext | undefined;
  users: UserCollection;
  userFetchError: string | null;
  userBlockError: string | null;
}

export type Machine = StateMachine<Context, any, AnyEventObject>;
export type Ref = ActorRefFrom<Machine>;
export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type UserContextValue = [State<Context>, Send<Context>];
