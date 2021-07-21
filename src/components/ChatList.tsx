import React, { FunctionComponent, useRef } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import ChatBox from "./ChatBox";

const ChatList: FunctionComponent = () => {
  const [{ context }] = useKernelContext().services.chat;
  const openChats = context.chats.filter((chat) => chat.isOpen);
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = (position: Record<string, number>) => {
    ref.current && ref.current.scrollTo(position)
  }

  return (
    <Wrapper className="ChatList" ref={ref}>
      {openChats.map((chat, key) => (
        <ChatBox key={key} chat={chat} scrollTo={scrollTo} />
      ))}
    </Wrapper>
  );
};

export default ChatList;

const Wrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  overflow-x: auto;
`;
