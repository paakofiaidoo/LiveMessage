import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Send } from "../shared-actions";
import { User } from "../../types";

export interface Context {
  users: User[];
  userFetchError: string | null;

  userList: Record<string, User>;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type UserContextValue = [State<Context>, Send<Context>];
