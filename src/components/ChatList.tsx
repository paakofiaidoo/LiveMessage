import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useChatContext } from "../services/chat";
import ChatBox from "./ChatBox";

const ChatList: FunctionComponent = () => {
  const [{ context }] = useChatContext();
  const openChats = context.chats.filter((chat) => chat.isOpen);

  return (
    <Wrapper className="ChatList">
      {openChats.map((chat, key) => (
        <ChatBox key={key} chat={chat} />
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
