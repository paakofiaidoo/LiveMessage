import { ActionFunctionMap, AnyEventObject, State } from "xstate";
import { Send } from "../shared-actions";
import { Chat, Message } from "../../types";

export interface Context {
  chats: Record<string, Chat>;
  selected: string;
  messages: Message[];
  message: string;

  // Errors
  fetchError: string | null;
  sendError: string | null;
}

export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
