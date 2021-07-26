import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useKernelContext } from "../services/kernel";
import { fadeDown } from "./anime";
import ChatBox from "./ChatBox";

const SingleChat: FunctionComponent = () => {
  const [{ context }] = useKernelContext().services.chat;
  const activeChat = context.activeChat;

  return (
    <Wrapper className="SingleChat">
      {activeChat && <ChatBox chat={activeChat} />}
      {!activeChat && (
        <div className="no-chat">
          <h2>Hello</h2>
          <p>Enjoy seemless interactions with anyone and everyone</p>
        </div>
      )}
    </Wrapper>
  );
};

export default SingleChat;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  /* overflow: hidden; */

  .no-chat {
    min-width: 100%;
    max-width: 120rem;
    padding: 3rem 10rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
      font-size: 8rem;
      margin-bottom: 0.4rem;
      animation: ${fadeDown} 1s ease-out 0s both;
    }

    p {
      font-size: 2rem;
      /* color: var(--color-grey-light); */
      animation: ${fadeDown} 1s ease-out 1.3s both;
    }
  }

  @media (max-width: 672px) {
    .no-chat {
      padding: 3rem 4rem;
    }
  }
`;
