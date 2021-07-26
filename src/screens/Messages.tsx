import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import { useKernelContext } from "../services/kernel";

import UserList from "../components/UserList";
import SingleChat from "../components/SingleChat";

const Messages: FunctionComponent = () => {
  const [{ context }] = useKernelContext().services.auth;

  // Check logged in
  if (!context.user) return <Redirect to="/login" />;

  return (
    <Wrapper className="Messages">
      <UserList />
      <SingleChat />
    </Wrapper>
  );
};

export default Messages;

const Wrapper = styled.div`
  display: flex;
  height: 90vh;
  width: 100rem;
  max-width: 100%;
  border-radius: 0.4rem;
  margin: auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 1px 20px rgba(0, 0, 0, 0.16);
  flex-grow: 0;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
  }
`;
