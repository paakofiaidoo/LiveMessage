import React, { FunctionComponent, useEffect, useRef } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { Message } from "../types";
import MessageCard from "./MessageCard";

interface Props {
  messages: Message[];
}

const MessageList: FunctionComponent<Props> = ({ messages }) => {
  const [{ context }] = useKernelContext().services.auth;
  const user = context.user;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ref
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight });
    }
  }, [messages]);

  return (
    <Wrapper className="MessageList" ref={ref}>
      {messages.map((msg, key) => (
        <MessageCard
          key={key}
          message={msg}
          isUser={msg.sentBy.id === (user && user.id)}
        />
      ))}
    </Wrapper>
  );
};

export default MessageList;

const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow-y: auto;

  .message {
    margin-bottom: 2rem;
  }

  .is-sender {
    text-align: right;
  }
`;
