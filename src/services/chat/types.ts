import {
  ActionFunctionMap,
  ActorRefFrom,
  AnyEventObject,
  State,
  StateMachine,
} from "xstate";
import { Send } from "../shared-actions";
import { Message } from "../../types";
import { Context as KernelContext } from "../kernel/types";

export interface ChatContext {
  isOpen: boolean;
  userId: string;
  messages: Message[];
  message: string;
  fetchError: string | null;
  sendError: string | null;
}

export interface Chat extends ChatContext {
  ref: ChatRef;
}

export interface Context {
  kernel: KernelContext | undefined;
  chats: Chat[];
  selected: string | null;
}

type SM<T> = StateMachine<T, any, AnyEventObject>;

export type ChatMachine = SM<ChatContext>;
export type Machine = SM<Context>;
export type ChatRef = ActorRefFrom<ChatMachine>;
export type Ref = ActorRefFrom<Machine>;
export type ChatAction = ActionFunctionMap<ChatContext, AnyEventObject>;
export type Action = ActionFunctionMap<Context, AnyEventObject>;
export type ContextValue = [State<Context>, Send<Context>];
