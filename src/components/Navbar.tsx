import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import Svg from "./Svg";

const Navbar: FunctionComponent = () => {
  const { auth, user } = useKernelContext().services;
  const [_, send] = auth;
  const [__, sendUser] = user;
  const open = false;

  const toggleUserList = () => sendUser("TOGGLE");

  return (
    <Wrapper className="Navbar">
      <NavItem onClick={toggleUserList}>
        <Link to="/" title="Messages">
          <Svg iconPath={"/icons/sprite.svg#speech-bubble"} />
          {open && <span>Messages</span>}
        </Link>
      </NavItem>

      <NavItem
        className="NavItem"
        title="Logout"
        onClick={() => send("LOGOUT")}
      >
        <Svg iconPath={"/icons/sprite.svg#exit"} />
      </NavItem>
    </Wrapper>
  );
};

export default Navbar;

const Wrapper = styled.nav`
  flex-shrink: 0;
  width: 7rem;
  height: 100%;
  box-shadow: 1px 0px 1px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .links a {
    display: block;
    padding: 0.3rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 1rem;
      margin-left: 0.5rem;
    }
  }
`;

const NavItem = styled.div`
  height: 6rem;
  padding: 0rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled.div`
  width: 100%;
  height: 6rem;
  padding: 0rem 2rem;
  display: flex;
  align-items: center;
`;
