import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router-dom";
import { useKernelContext } from "../services/kernel";
import { fadeDown, fadeUp } from "../components/anime";
const GOOGLE_ID =
  "833267131071-cq5s14mino3kv30433m5rbaqjhn42mo2.apps.googleusercontent.com";

const Login: FunctionComponent = () => {
  const [{ context }, send] = useKernelContext().services.auth;

  // Check logged in
  if (context.user) return <Redirect to="/" />;

  return (
    <Wrapper className="Login">
      <h1>Live Message </h1>
      <p>with Multi-Windows</p>

      <GoogleLogin
        className="login-button"
        clientId={GOOGLE_ID}
        buttonText="Login With Google"
        onSuccess={(res: any) => {
          send({ type: "LOGIN", token: res.tokenId });
        }}
        onFailure={(e) => {
          send({ type: "ERROR", error: e });
        }}
        cookiePolicy={"single_host_origin"}
        disabled={context.authenticating}
      />
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

  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    animation: ${fadeDown} 1s ease-out both;
    font-size: 3.4rem;
  }

  p {
    padding: 0rem 2rem;
    color: var(--color-grey-light);
    animation: ${fadeUp} 1s ease-out 0.8s both;
    font-size: 1.8rem;

    &::before {
      content: "";
      height: 0.2rem;
      width: 2rem;
      background-color: var(--color-grey-light);
    }
  }

  .login-button {
    animation: ${fadeDown} 1s ease-out 1.6s both;
  }

  @media (max-width: 720px) {
    flex-direction: column;

    p {
      margin-bottom: 2rem;
    }
  }
`;
