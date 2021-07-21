import { useActor } from "@xstate/react";
import React, { FunctionComponent, RefObject, useEffect, useRef } from "react";
import styled from "styled-components";
import { Chat } from "../services/chat/types";
import { useKernelContext } from "../services/kernel";
import ChatBoxHeader from "./ChatBoxHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

interface Props {
  chat: Chat;
  scrollTo(position: Record<string, number>): void;
}

const ChatBox: FunctionComponent<Props> = ({ chat, scrollTo }) => {
  const [chatState] = useKernelContext().services.chat;
  const [{ context }, send] = useActor(chat.ref);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll To Chat
  useEffect(() => {
    if (chatState.context.selected !== chat.userId || !ref.current) return;

    // scrollTo({ left: ref.current.offsetLeft });
    scrollTo({ left: ref.current.offsetLeft - (ref.current.offsetWidth - 40) });
  }, [chatState.context.selected]);

  // Fetch Message
  // useEffect(() => {
  //   send({ type: "FETCH" });
  // }, [context.isOpen]);

  useEffect(() => {
    send({ type: "FETCH" });
  }, []);

  return (
    <Wrapper className={`ChatBox`} ref={ref}>
      <ChatBoxHeader chat={chat} />
      <MessageList messages={context.messages} />
      <MessageInput chatRef={chat.ref} />
    </Wrapper>
  );
};

export default ChatBox;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease-in-out;
  flex-shrink: 1;
  flex-grow: 1;

  height: 100%;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.12);

  > * {
    min-width: 33rem;
  }
`;
