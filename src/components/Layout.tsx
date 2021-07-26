import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const Layout: FunctionComponent = ({ children }) => {
  return <Wrapper className="Layout">{children}</Wrapper>;
};

export default Layout;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
`;
