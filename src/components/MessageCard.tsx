import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Message } from "../types";
import Avatar from "./Avatar";

interface Props {
  message: Message;
  isUser?: boolean;
}

const MessageCard: FunctionComponent<Props> = ({ message, isUser }) => {
  const addressAs = isUser ? "You" : message.sentBy.name;
  // const date = new Date(Number(message.sentAt));
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;

  return (
    <Wrapper className={`MessageCard ${addressAs}`}>
      <Avatar
        className="xsmall dp"
        src={message.sentBy.image}
        alt={message.sentBy.name + "'s profile picture"}
      />

      <div className="content">
        <h2>
          {addressAs}
          <span>{message.sentBy.email}</span>
        </h2>
        <p>{message.content}</p>
      </div>
    </Wrapper>
  );
};

export default MessageCard;

const Wrapper = styled.article`
  padding: 2rem;
  display: flex;
  margin-bottom: 0.5rem;
  height: auto;
  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .dp {
    margin-right: 1rem;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .content {
    flex-grow: 1;
    border-radius: 0.4rem;

    h2 {
      display: block;
      font-size: 1.2rem;
      line-height: 1.15;
      margin-bottom: 1rem;
      color: var(--color-secondary);

      span {
        display: block;
        font-size: 1.2rem;
        font-weight: normal;
        color: var(--color-grey-light);
      }
    }
  }
`;
