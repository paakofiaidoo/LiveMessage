import { useActor } from "@xstate/react";
import React, { FunctionComponent, useEffect, useRef } from "react";
import styled from "styled-components";
import { Chat } from "../services/chat/types";
import ChatBoxHeader from "./ChatBoxHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

interface Props {
  chat: Chat;
}

const ChatBox: FunctionComponent<Props> = ({ chat }) => {
  // return null;
  const [{ context }, send] = useActor(chat.ref);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch Message
  useEffect(() => {
    send({ type: "FETCH" });
  }, [chat]);

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
  background-color: rgba(0, 0, 0, 0.1);
  background-color: var(--color-tertiary-light-1);

  > * {
    min-width: 30rem;
  }
`;
