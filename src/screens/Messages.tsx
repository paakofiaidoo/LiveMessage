import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import { useAuthContext } from "../services/auth";

import AppBar from "../components/AppBar";
import UserList from "../components/UserList";
import ChatList from "../components/ChatList";

const Messages: FunctionComponent = () => {
  const [{ context }] = useAuthContext();

  // Check logged in
  if (!context.user) return <Redirect to="/login" />;

  return (
    <Wrapper className="Messages">
      {/* <AppBar title="Live Messages" /> */}
      <div className="AppBody">
        <UserList />
        <ChatList />
      </div>
    </Wrapper>
  );
};

export default Messages;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;

  .AppBody {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
  }
`;
