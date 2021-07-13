import React, { FunctionComponent } from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { Message } from "../types";
import Avatar from "./Avatar";

interface Props {
  message: Message;
  isUser?: boolean;
}

const MessageCard: FunctionComponent<Props> = ({ message, isUser }) => {
  const { path } = useRouteMatch();
  const addressAs = isUser ? "You" : message.sentBy.name;
  // const date = new Date(Number(message.sentAt));
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;

  return (
    <Wrapper className="MessageCard" id={path + "#" + message.id}>
      <div className="header">
        <Avatar
          className="dp"
          src={message.sentBy.image}
          alt={message.sentBy.name + "'s profile picture"}
        />
        <h2>
          {message.sentBy ? addressAs : "Unknown"}
          <span>{time}</span>
          {/* {message.sentBy.name} <span>{time}</span> */}
          {/* {message.sentBy} <span>{time}</span> */}
        </h2>
      </div>

      <p>{message.content}</p>
    </Wrapper>
  );
};

export default MessageCard;

const Wrapper = styled.article`
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem var(--spacing-h);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .dp {
    margin-right: 1rem;
  }

  h2 span {
    display: block;
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--color-grey-light);
  }

  p {
    padding-left: 5rem;
  }
`;
