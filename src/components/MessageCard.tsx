import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Message } from "../services/message/types";
import { User } from "../types";
import { anime, fadeIn } from "./anime";
import Avatar from "./Avatar";

interface Props {
  message: Message;
  sentBy: User;
  isUser?: boolean;
}

const MessageCard: FunctionComponent<Props> = ({ sentBy, message, isUser }) => {
  const addressAs = isUser ? "You" : sentBy.name;

  return (
    <Wrapper className={`MessageCard ${addressAs}`}>
      <div className="content">
        <h2>{addressAs}</h2>
        <p>{message.content}</p>
      </div>
    </Wrapper>
  );
};

export default MessageCard;

const Wrapper = styled.article`
  padding: 0.1rem 2rem;
  display: flex;
  margin-bottom: 0.5rem;
  height: auto;
  width: 100%;
  position: relative;

  ${anime({ name: fadeIn, duration: 0.5 })}

  .content {
    border-radius: 0.4rem;
    flex-grow: 0;
    width: auto;
    min-width: 5rem;
    max-width: 50rem;
    background-color: var(--color-primary);
    padding: 1rem;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);

    h2 {
      line-height: 1.15;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      font-weight: normal;
      color: var(--color-grey-light);
    }
  }

  &.You {
    flex-direction: row-reverse;
  }

  @media (max-width: 672px) {
    .content {
      max-width: 90%;
    }
  }
`;
