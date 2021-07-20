import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <Wrapper className="Layout">
      <Navbar />
      <main> {children} </main>
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;

  main {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }
`;
