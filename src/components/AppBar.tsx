import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props {
  title?: string;
}

const AppBar: FunctionComponent<Props> = ({ title }) => {
  return (
    <Wrapper className="AppBar">
      <h2>{title || "Untitled"}</h2>
    </Wrapper>
  );
};

export default AppBar;

const Wrapper = styled.div`
  width: 100%;
  height: 6rem;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  padding: 0rem 2rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  h2 {
    line-height: normal;
    margin: 0;
  }
`;
