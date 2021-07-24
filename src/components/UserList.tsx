import React, { FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { anime, fadeIn, fadeOut, softClose } from "./anime";
import AppUser from "./AppUserCard";
import MenuButton from "./MenuButton";
import UserCard from "./UserCard";

const UserList: FunctionComponent = () => {
  const { auth, user } = useKernelContext().services;
  const [{ context }, send] = user;
  const [authState] = auth;
  const appUser = authState.context.user;
  const userList = Object.values(context.users);

  const toggleList = () => send("TOGGLE");

  if (!appUser) return null;

  useEffect(() => {
    send("FetchUsers");
  }, []);

  return (
    <Wrapper className={`UserList ${!context.isOpen ? "minimize" : ""}`}>
      <header>
        <MenuButton className="menu-button" onClick={toggleList} />{" "}
        <h2>Live Message</h2>
      </header>
      <div className="user-list">
        {userList.map((user, key) => (
          <UserCard
            key={key}
            user={user}
            isMe={(appUser && appUser.id) === user.id}
            isMinimized={!context.isOpen}
          />
        ))}
      </div>
      <footer>
        <AppUser isMinimized={!context.isOpen} />
      </footer>
    </Wrapper>
  );
};

export default UserList;

const Wrapper = styled.nav`
  position: relative;
  width: 8rem;
  height: 100%;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  overflow: hidden;

  ${anime({
    name: softClose("8rem", "30rem"),
    duration: 0.3,
  })}

  > * {
    width: 30rem;
  }

  > header {
    flex-grow: 0;
    flex-shrink: 0;
    height: 6rem;
    display: flex;
    align-items: center;
    padding: 0rem 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    h2 {
      ${anime({ name: fadeIn, duration: 0.3, delay: 0.3 })}
    }
  }

  > footer {
    flex-grow: 0;
    flex-shrink: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .user-list {
    flex-grow: 1;
  }

  &.minimize {
    ${anime({
      name: softClose("30rem", "8rem"),
      duration: 0.3,
      delay: 0.3,
    })}

    header h2 {
      ${anime({ name: fadeOut, duration: 0.3 })}
    }
  }

  @media (max-width: 672px) {
    /* display: none; */
  }
`;
