import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar: FunctionComponent = () => {
  return (
    <Wrapper className="Navbar">
      <div className="brand">Live Message</div>
      <div className="links">
        <Link to="/">Messages</Link>
        <Link to="/login">Login</Link>
      </div>
    </Wrapper>
  );
};

export default Navbar;

const Wrapper = styled.nav`
  flex-shrink: 0;
  width: 13rem;
  height: 100%;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */

  .brand {
    margin-bottom: 2rem;
    padding: 1rem;
  }

  .links a {
    display: block;
    padding: 0.3rem 1rem;
  }
`;
