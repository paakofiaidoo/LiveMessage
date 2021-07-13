import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { GoogleLogin } from "react-google-login";
import { useAuthContext } from "../store/auth-store";
import { AuthMessage } from "../store/message";
import { Redirect } from "react-router-dom";

const GOOGLE_ID =
  "833267131071-cq5s14mino3kv30433m5rbaqjhn42mo2.apps.googleusercontent.com";

const Login: FunctionComponent = () => {
  const [{ context }, send] = useAuthContext();

  // Check logged in
  if (context.user) return <Redirect to="/" />;

  return (
    <Wrapper className="Login">
      <h1>AfroChat </h1>
      <p>Login to start chating</p>

      <div className="login-card">
        <GoogleLogin
          clientId={GOOGLE_ID}
          buttonText="Login With Google"
          onSuccess={(res: any) => {
            send(AuthMessage.Login, { token: res.tokenId });
          }}
          onFailure={(e) => {
            send(AuthMessage.Error, { error: e });
          }}
          cookiePolicy={"single_host_origin"}
          disabled={context.authenticating}
        />
      </div>
    </Wrapper>
  );
};

export default Login;

// Styling
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .login-card {
  }
`;
