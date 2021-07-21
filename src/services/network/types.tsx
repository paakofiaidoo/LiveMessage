import {
  ActionFunctionMap,
  AnyEventObject,
  State,
  StateMachine,
  ActorRefFrom,
} from "xstate";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Context as KernelContext } from "../kernel/types";
import { Send } from "../shared-actions";

export interface Context {
  kernel: KernelContext | undefined;
  ws: SubscriptionClient | undefined;
}

export type Machine = StateMachine<Context, any, AnyEventObject>;
export type Ref = ActorRefFrom<Machine>;
export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
export type NetworkActor = [State<Context>, Send<Context>];
