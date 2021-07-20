import React, { FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import { useAuthContext } from "../services/auth";
import { useUserContext } from "../services/user";
import UserCard from "./UserCard";

const UserList: FunctionComponent = () => {
  const [{ context }, send] = useUserContext();
  const [authState] = useAuthContext();
  const appUser = authState.context.user;
  const userList = Object.values(context.users);

  useEffect(() => {
    send("FetchUsers");
  }, []);

  return (
    <Wrapper className="UserList">
      <header>
        <h2>Users</h2>
        <p>
          Seemless interactions with other users and send messages to yourself
          as notes
        </p>
      </header>
      {userList.map((user, key) => (
        <UserCard
          key={key}
          user={user}
          isMe={(appUser && appUser.id) === user.id}
          blockUser={() => send("BlockUser", { id: user.id })}
        />
      ))}
    </Wrapper>
  );
};

export default UserList;

const Wrapper = styled.nav`
  width: 30rem;
  height: 100%;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;

  .user {
    display: flex;
    padding: 1.5rem 2rem;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: var(--color-tertiary-light);
    }

    &.selected {
      background-color: var(--color-secondary);

      h2 {
        color: var(--color-primary);
      }
    }
  }

  .dp {
    margin-right: 1rem;
  }

  span {
    display: block;
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--color-grey-light);
  }

  .status {
    font-size: 1rem;
    color: var(--color-tertiary);
  }

  header {
    padding: 2rem;

    p {
      color: var(--color-grey-light);
    }
  }
`;
