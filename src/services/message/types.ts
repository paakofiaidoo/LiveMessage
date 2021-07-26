import {
  ActionFunctionMap,
  ActorRefFrom,
  AnyEventObject,
  StateMachine,
} from "xstate";
// import { User } from "../../types";

export interface CreateMachineOptions {
  new: boolean;
}

export interface MessageContext {
  id: string;
  sentBy: string;
  sentTo: string;
  content: string;
  sentAt: string;
  isSent: boolean;
  sendError: string | null;
}

export interface Message extends MessageContext {
  ref: MessageRef;
}

export type MessageMachine = StateMachine<MessageContext, any, AnyEventObject>;
export type MessageRef = ActorRefFrom<MessageMachine>;
export type MessageAction = ActionFunctionMap<MessageContext, AnyEventObject>;
