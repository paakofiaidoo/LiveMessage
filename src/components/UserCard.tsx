import React, { FunctionComponent } from "react";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { User } from "../types";
import Avatar from "./Avatar";

interface IRoute {
  path: string;
  url: string;
  params: { id: string };
}

interface Props {
  user: User;
  isMe: boolean;
  blockUser(): void;
}

const UserCard: FunctionComponent<Props> = ({ user, isMe, blockUser }) => {
  let { url }: IRoute = useRouteMatch();
  const { pathname } = useLocation();
  const userLink = url + user.id;
  const selected = userLink === pathname ? "selected" : "";

  return (
    <Wrapper className={`UserCard ${selected}`}>
      <Avatar
        className="dp"
        src={user.image}
        alt={user.name + "'s profile picture"}
      />
      <h2>
        {user.name}
        <span>{user.email}</span>
        <span className="status">{user.status}</span>
      </h2>

      <div className="actions">
        <Link to={userLink}>{isMe ? "My Notes" : "Chat"}</Link>
        {!isMe && <button onClick={blockUser}>Block</button>}
      </div>
    </Wrapper>
  );
};

export default UserCard;

const Wrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
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

  .actions {
    width: 100%;
  }
`;
