import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { User } from "../types";
import Avatar from "./Avatar";
import Svg from "./Svg";
import { anime, fadeIn, fadeOut } from "./anime";

interface Props {
  user: User;
  isMe: boolean;
  isMinimized: boolean;
}

const UserCard: FunctionComponent<Props> = ({ user, isMe, isMinimized }) => {
  const [{ context }, send] = useKernelContext().services.chat;
  const selected = context.selected === user.id ? "selected" : "";
  const minimize = isMinimized ? "minimize" : "";
  const isOnline = user.status === "online";
  const selectChat = () => send({ type: "CHAT.START", userId: user.id });

  return (
    <Wrapper
      className={`UserCard ${selected} ${minimize}`}
      onClick={selectChat}
    >
      <Avatar
        className={`image ${isOnline ? "active" : ""}`}
        src={user.image}
        alt={user.name + "'s profile picture"}
      />
      <h2>
        {user.name} {isMe && "(You)"}
        <span>{user.email}</span>
        <span role="button" className="status">
          {user.status}
        </span>
      </h2>

      <button title={isMe ? "My Notes" : "Chat"} className="chat-link">
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
  cursor: pointer;

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
    color: var(--color-terit);
    cursor: pointer;
    display: inline-block;
  }

  &:hover {
    background-color: var(--color-tertiary-light);

    .chat-link svg {
      transform: scale(1.3);
    }
  }

  &.selected {
    background-color: var(--color-secondary);

    h2 {
      color: var(--color-primary);
    }

    .chat-link {
      background-color: transparent;

      svg {
        transform: scale(1.3);
        fill: var(--color-tertiary-light);
      }
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
  }

  h2,
  button {
    ${anime({ name: fadeIn, duration: 0.3, delay: 0.3 })}
  }

  &.minimize {
    h2,
    button {
      ${anime({ name: fadeOut, duration: 0.3 })}
    }
  }

  @media (max-width: 672px) {
    padding: 1.5rem 1rem;

    .image {
      width: 3.5rem;
      height: 3.5rem;
    }

   
  }
`;
