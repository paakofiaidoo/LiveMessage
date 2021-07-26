import React, { FunctionComponent, useEffect, useRef } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { Message } from "../services/message/types";
import MessageCard from "./MessageCard";

interface Props {
  messages: Message[];
}

const MessageList: FunctionComponent<Props> = ({ messages }) => {
  const services = useKernelContext().services;
  const [{ context }] = services.auth;
  const [userState] = services.user;
  const user = context.user;
  const ref = useRef<HTMLDivElement>(null);

  if (!user) return null;

  useEffect(() => {
    // Ref
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight });
    }
  }, [messages]);

  return (
    <Wrapper className="MessageList" ref={ref}>
      {messages.map((msg, key) => {
        const isSentByUser = msg.sentBy === user.id;
        const sentBy = isSentByUser
          ? user
          : userState.context.users[msg.sentBy];

        return (
          <MessageCard
            key={key}
            message={msg}
            sentBy={sentBy}
            isUser={isSentByUser}
          />
        );
      })}
    </Wrapper>
  );
};

export default MessageList;

const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding: 1rem 0rem;

  .message {
    margin-bottom: 2rem;
  }

  .is-sender {
    text-align: right;
  }
`;
