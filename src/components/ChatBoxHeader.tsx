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
  const [menu, setMenu] = useState(false);
  const [{ context }, send] = useActor(chat.ref);
  const services = useKernelContext().services;
  const [userState, sendUser] = services.user;
  const [authState] = services.auth;

  const me = authState.context.user;
  const isMe = (me && me.id) === context.userId;
  const sentTo = userState.context.users[context.userId];

  const toggleMenu = () => setMenu(!menu);
  const blockUser = () => sendUser({ type: "BlockUser", id: sentTo.id });
  const closeChat = () => send({ type: "CLOSE" });

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
          className={`close-action ${menu ? "active" : ""}`}
        >
          <Svg iconPath="/icons/sprite.svg#menu" />
        </button>
      </div>

      {menu && (
        <Menu
          isMe={isMe}
          closeChat={closeChat}
          toggleMenu={toggleMenu}
          blockUser={blockUser}
        />
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
  background-color: var(--color-primary);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    /* margin-left: auto; */
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

interface MenuProps {
  isMe: boolean;
  blockUser(): void;
  closeChat(): void;
  toggleMenu(): void;
}

const Menu: FunctionComponent<MenuProps> = ({
  isMe,
  closeChat,
  toggleMenu,
  blockUser,
}) => {
  const [block, setBlock] = useState(false);

  return (
    <MenuWrapper className="Menu" onBlur={toggleMenu} autoFocus>
      {!isMe && (
        <div
          onClick={() => setBlock(!block)}
          className={`item block-user ${block ? "selected" : ""}`}
        >
          <span className="label">Block User</span>
          <div className="subitem">
            <span className="question">Are you sure?</span>
            <a role="button" onClick={toggleMenu}>
              No
            </a>{" "}
            <a role="button" onClick={blockUser}>
              Yes
            </a>
          </div>
        </div>
      )}
      {/* <a role="button" className={`item`} onClick={closeChat}>
        <span className="label">Close Chat</span>
      </a> */}
    </MenuWrapper>
  );
};

const MenuWrapper = styled.button`
  display: block;
  width: 20rem;
  padding: 1rem 0rem;
  border-radius: 0.2rem;
  position: absolute;
  right: 3.4rem;
  top: calc(100% - 2rem);
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.16);
  background-color: var(--color-primary);
  text-align: left;
  z-index: +1;

  .item {
    cursor: pointer;
    display: block;
    padding: 0.5rem 2rem;
  }

  .block-user {
    .label {
      display: block;
      color: inherit;
      /* margin-bottom: 0.2rem; */

      &:hover {
        color: var(--color-tertiary);
      }
    }

    .subitem {
      display: none;

      .question {
        color: var(--color-grey-light);
        margin-right: 1rem;
        font-size: 1.2rem;
        font-weight: normal;
      }

      a {
        margin-right: 1.5rem;
        color: var(--color-body-text);

        &:hover {
          color: var(--color-tertiary);
          text-decoration: underline;
        }
      }
    }

    &.selected {
      .label {
        color: var(--color-body-text);

        /* .label {
        font-size: 1.3rem;
        font-weight: normal;
        color: var(--color-grey-light);
        margin-bottom: 0.5rem;
      } */
      }

      .subitem {
        display: block;
      }
    }
  }
`;
