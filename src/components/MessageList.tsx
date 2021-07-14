import React, { FunctionComponent, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useMessageContext } from "../services/message";
import { useAuthContext } from "../services/auth";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import { MessageMessage } from "../services/service-message";

interface Params {
  id: string;
}

const MessageList: FunctionComponent = () => {
  const { id }: Params = useParams();
  const [{ context }, send] = useMessageContext();
  const authContext = useAuthContext()[0].context;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    send(MessageMessage.Select, { id });
  }, [id]);

  useEffect(() => {
    // Ref
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight });
    }
  });

  if (!authContext.user) return <Wrapper>Invalid User</Wrapper>;

  return (
    <Wrapper className="MessageList">
      <div className="list" ref={ref}>
        {context.messages.map((msg, key) => (
          <MessageCard
            key={key}
            message={msg}
            isUser={msg.sentBy.id === (authContext.user && authContext.user.id)}
          />
          // <p style={{ color: "red" }}>{msg.content}</p>
        ))}
      </div>
      <MessageInput />
    </Wrapper>
  );
};

export default MessageList;

const Wrapper = styled.div`
  flex-grow: 1;
  height: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;

  .is-sender {
    text-align: right;
  }

  .list {
    flex-grow: 1;
    overflow-y: auto;

    .message {
      margin-bottom: 2rem;
    }
  }
`;
