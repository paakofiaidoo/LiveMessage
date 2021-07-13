import React, { FunctionComponent } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import UserList from "../components/UserList";
import MessageList from "../components/MessageList";
import { useAuthContext } from "../store/auth-store";
import { AuthMessage } from "../store/message";

const Messages: FunctionComponent = () => {
  const { path } = useRouteMatch();
  const [{ context }, send] = useAuthContext();

  // Check logged in
  if (!context.user) return <Redirect to="/login" />;

  return (
    <Wrapper className="Messages">
      <UserList />
      <Switch>
        <Route path={path} exact>
          <div className="unselected">
            <h3>Please Selected a user to chat with</h3>
            <button onClick={() => send(AuthMessage.Logout)}>Logout</button>
          </div>
        </Route>
        <Route path={`${path}:id`} component={MessageList} exact />
      </Switch>
    </Wrapper>
  );
};

export default Messages;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  position: relative;
`;
