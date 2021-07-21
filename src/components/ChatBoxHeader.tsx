import { useActor } from "@xstate/react";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Chat } from "../services/chat/types";
import { useKernelContext } from "../services/kernel";
import Avatar from "./Avatar";
import Svg from "./Svg";

interface Props {
  chat: Chat;
}

const ChatBoxHeader: FunctionComponent<Props> = ({ chat }) => {
  const [toggle, setToggle] = useState({ menu: false, block: false });
  const [{ context }, send] = useActor(chat.ref);
  const services = useKernelContext().services;
  const [userState, sendUser] = services.user;
  const [authState] = services.auth;

  const me = authState.context.user;
  const isMe = me && me.id === context.userId;
  const sentTo = userState.context.users[context.userId];

  const closeChat = () => send({ type: "CLOSE" });
  const blockUser = () => sendUser({ type: "BlockUser", id: sentTo.id });
  const toggleMenu = () => setToggle({ menu: !toggle.menu, block: false });
  const toggleBlockUser = () => setToggle({ ...toggle, block: !toggle.block });

  return (
    <Wrapper className={`ChatBoxHeader `}>
      <div className="header">
        <Avatar
          className="xsmall dp"
          src={sentTo.image}
          alt={sentTo.name + "'s profile picture"}
        />
        <h2>{sentTo.name}</h2>
        <button
          title="Chat Settings"
          onClick={toggleMenu}
          className={`close-action ${toggle && "active"}`}
        >
          <Svg iconPath="/icons/sprite.svg#menu" />
        </button>
      </div>

      {toggle.menu && (
        <Menu className="menu">
          {!isMe && (
            <div className={`block-user ${toggle.block && "selected"}`}>
              <span onClick={toggleBlockUser} className={`label`}>
                Block User
              </span>
              {toggle.block && (
                <>
                  <span className="question">
                    Are you sure you want block user?
                  </span>
                  <a role="button" onClick={toggleMenu}>
                    No
                  </a>{" "}
                  <a role="button" onClick={blockUser}>
                    Yes
                  </a>
                </>
              )}
            </div>
          )}
          <button onClick={closeChat}>Close Chat</button>
        </Menu>
      )}
    </Wrapper>
  );
};

export default ChatBoxHeader;

const Wrapper = styled.header`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;

  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
    padding: 1rem 2rem;
  }

  .image {
    margin-right: 1rem;
  }

  h2 {
    font-size: 1.2rem;
    text-transform: capitalize;
  }

  .close-action {
    width: 3rem;
    height: 3rem;
    border: none;
    background-color: transparent;

    svg {
      height: 1.5rem;
    }

    &.active svg {
      fill: var(--color-tertiary);
    }

    &:hover svg {
      fill: var(--color-tertiary);
    }
  }
`;

const Menu = styled.div`
  width: 100%;
  padding: 1rem 2rem 2rem 2rem;
  text-align: center;

  > * {
    display: block;
    width: 100%;
    padding: 0.5rem 0rem;
    color: var(--color-tertiary);
    border: none;
    outline: 0;
    background-color: transparent;
  }

  button,
  a,
  .label {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .block-user {
    width: 100%;
    display: inline-block;
    color: var(--color-tertiary);

    .label {
      display: block;
      color: inherit;
      margin-bottom: 0.2rem;
    }

    .question {
      display: none;
      color: var(--color-grey-light);
      margin-right: 1rem;
      font-size: 1.2rem;
      font-weight: normal;
    }

    a {
      display: none;
      margin-right: 1.5rem;
      color: var(--color-body-text);
      opacity: 0;

      &:hover {
        color: var(--color-tertiary);
        text-decoration: underline;
      }
    }

    &.selected {
      color: var(--color-body-text);

      .label {
        font-size: 1.3rem;
        font-weight: normal;
        color: var(--color-grey-light);
        margin-bottom: 0.5rem;
      }

      .question {
        display: inline-block;
      }

      a {
        display: inline-block;
        opacity: 1;
      }
    }
  }
`;
