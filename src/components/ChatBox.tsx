import { useActor } from "@xstate/react";
import React, { FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import { Chat } from "../services/chat/types";
import ChatBoxHeader from "./ChatBoxHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

interface Props {
  chat: Chat;
}

const ChatBox: FunctionComponent<Props> = ({ chat }) => {
  const [{ context }, send] = useActor(chat.ref);

  // Fetch Message
  useEffect(() => {
    send({ type: "FETCH" });
  }, [context.isOpen]);

  return (
    <Wrapper className={`ChatBox`}>
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
  flex-shrink: 0;
  flex-grow: 0;

  width: 33rem;
  height: 100%;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.12);
`;

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;

  width: 100%;
  height: 6rem;
  padding: 1rem 2rem;

  .image {
    margin-right: 1rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  span {
    display: block;
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--color-grey-light);
  }

  .block-user {
    font-size: 1rem;
    color: var(--color-tertiary);
    cursor: pointer;
    display: inline-block;

    &:hover {
      transform: scale(1.05);
    }
  }
`;
