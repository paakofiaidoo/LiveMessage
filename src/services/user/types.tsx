import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Send } from "../shared-actions";
import { User } from "../../types";

export type UserCollection = Record<string, User>;

export interface Context {
  users: UserCollection;

  userFetchError: string | null;
  userBlockError: string | null;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type UserContextValue = [State<Context>, Send<Context>];
