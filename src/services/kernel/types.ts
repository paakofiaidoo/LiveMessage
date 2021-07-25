import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { ChatActor, Ref as ChatRef } from "../chat/types";
import { NetworkActor, Ref as NetworkRef } from "../network/types";
import { Ref as UserRef, UserActor } from "../user/types";
import { AuthActor, Ref as AuthRef } from "../auth/types";
import { Send } from "../shared-actions";

export interface Context {
  chat: ChatRef;
  network: NetworkRef;
  user: UserRef;
  auth: AuthRef;
}

export interface Services {
  auth: AuthActor;
  network: NetworkActor;
  user: UserActor;
  chat: ChatActor;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export interface ContextValue {
  services: Services;
  state: State<Context>;
  send: Send<Context>;
}
