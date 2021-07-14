import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Send } from "../shared-actions";
import { SubscriptionClient } from "subscriptions-transport-ws";

export interface Context {
  ws: SubscriptionClient | undefined;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
