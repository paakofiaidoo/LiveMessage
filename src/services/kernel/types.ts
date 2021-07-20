import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Ref as ChatRef } from "../chat/types";
import { Ref as NetworkRef } from "../network/types";
import { Ref as UserRef } from "../user/types";
import { Ref as AuthRef } from "../auth/types";
import { Send } from "../shared-actions";

export interface Context {
  chat: ChatRef;
  network: NetworkRef;
  user: UserRef;
  auth: AuthRef;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
