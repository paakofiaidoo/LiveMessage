import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useChatContext } from "../services/chat";
import { User } from "../types";
import Avatar from "./Avatar";
import Svg from "./Svg";

interface Props {
  user: User;
  isMe: boolean;
  blockUser(): void;
}

const UserCard: FunctionComponent<Props> = ({ user, isMe, blockUser }) => {
  const [{ context }, send] = useChatContext();
  const selected = context.selected === user.id ? "selected" : "";
  const isOnline = user.status === "online";
  const selectChat = () => send("CHAT.START", { userId: user.id });

  return (
    <Wrapper className={`UserCard ${selected}`}>
      <Avatar
        className={`image ${isOnline ? "active" : ""}`}
        src={user.image}
        alt={user.name + "'s profile picture"}
      />
      <h2>
        {user.name}
        <span>{user.email}</span>
        <span role="button" className="status">
          {user.status}
        </span>
      </h2>

      <button
        onClick={selectChat}
        title={isMe ? "My Notes" : "Chat"}
        className="chat-link"
      >
        <Svg iconPath="/icons/sprite.svg#chat" />
      </button>
    </Wrapper>
  );
};

export default UserCard;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  transition: all 0.5s ease-in-out;

  .image {
    margin-right: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  span {
    display: block;
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--color-grey-light);
    line-height: 1;
  }

  .status {
    font-size: 1rem;
    color: var(--color-tertiary);
    cursor: pointer;
    display: inline-block;
  }

  &:hover {
    background-color: var(--color-tertiary-light);
  }

  &.selected {
    background-color: var(--color-secondary);

    h2 {
      color: var(--color-primary);
    }
  }

  .chat-link {
    display: flex;
    height: 100%;
    color: var(--color-primary);
    margin-left: auto;

    display: inline-block;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-tertiary-light);
    border: none;
    border-radius: 0.2rem;

    svg {
      fill: var(--color-secondary);
      height: 1.5rem;
    }

    &:hover {
      transform: scale(1.2);
    }
  }
`;
