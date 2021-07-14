import React, { FunctionComponent, useEffect } from "react";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../services/user";
import Avatar from "./Avatar";

interface IRoute {
  path: string;
  url: string;
  params: { id: string };
}

const UserList: FunctionComponent = () => {
  let { url }: IRoute = useRouteMatch();
  const { pathname } = useLocation();
  const [{ context }, send] = useUserContext();
  const userList = Object.values(context.userList);

  useEffect(() => {
    send("FETCH_USERS");
  }, []);

  return (
    <Wrapper className="UserList">
      {userList.map((user, key) => {
        const to = url + user.id;

        return (
          <Link
            to={to}
            key={key}
            className={`user ${to === pathname ? "selected" : ""}`}
          >
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
          </Link>
        );
      })}
    </Wrapper>
  );
};

export default UserList;

const Wrapper = styled.nav`
  width: 25rem;
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
`;
