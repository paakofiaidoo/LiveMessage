import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Send } from "../shared-actions";
import { User } from "../../types";

export interface Context {
  user: User | null;
  authenticating: boolean;
  error: string | null;
  token: string;
}
export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
