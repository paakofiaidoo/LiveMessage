import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { anime, fadeIn, fadeOut } from "./anime";
import Avatar from "./Avatar";
import Svg from "./Svg";

interface Props {
  isMinimized: boolean;
}

const AppUser: FunctionComponent<Props> = ({ isMinimized }) => {
  const [toggle, setToggle] = useState(false);
  const [{ context }, send] = useKernelContext().services.auth;
  const user = context.user;
  const minimize = isMinimized ? "minimize" : "";

  const toggleMenu = () => setToggle(!toggle);
  const logout = () => send("LOGOUT");

  if (!user) return null;

  return (
    <Wrapper className={`AppUser ${toggle ? "active" : ""} ${minimize}`}>
      <div className="actions">
        <button onClick={logout}>
          <Svg iconPath="/icons/sprite.svg#exit" /> <span>Logout</span>
        </button>
      </div>
      <div onClick={toggleMenu} className="user">
        <Avatar
          className={`image`}
          src={user.image}
          alt={user.name + "'s profile picture"}
        />
        <h2>
          {user.name}
          <span>{user.email}</span>
        </h2>
      </div>
    </Wrapper>
  );
};

export default AppUser;

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;

  .user {
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
  }

  .actions {
    position: relative;
    width: 100%;
    height: 0;
    background-color: var(--color-primary);
    overflow: hidden;

    button {
      display: flex;
      align-items: center;
      padding: 2rem 2rem;
      width: 100%;

      svg {
        height: 1.6rem;
        margin-right: 1rem;
      }

      &:hover {
        background-color: var(--color-tertiary-light);

        svg {
          transform: scale(1.1);
        }

        span {
          transform: scale(1.05);
        }
      }
    }
  }

  &.active .actions {
    height: auto;
  }

  h2 {
    ${anime({ name: fadeIn, duration: 0.3, delay: 0.3 })}
  }

  &.minimize {
    h2 {
      ${anime({ name: fadeOut, duration: 0.3 })}
    }
  }
`;
