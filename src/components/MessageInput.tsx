import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { MessageMessage } from "../store/service-message";
import { useMessageContext } from "../store/message";

const MessageInput: FunctionComponent = () => {
  const [{ context }, send] = useMessageContext();

  return (
    <Wrapper className="message-input">
      <textarea
        name="message"
        placeholder="Enter your reply here..."
        onChange={(e) => {
          send(MessageMessage.Typing, { message: e.target.value });
        }}
        value={context.message}
      ></textarea>
      <button onClick={() => send(MessageMessage.Send)}>Send</button>
    </Wrapper>
  );
};

export default MessageInput;

const Wrapper = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;

  flex-grow: 0;
  height: 22rem;
  padding: 2rem var(--spacing-h);
  display: flex;
  flex-wrap: wrap;

  textarea {
    width: 100%;
    height: 12rem;
    padding: 2rem;
    border-radius: 0.6rem;
    border: 0.2rem solid #dbdcde;
    margin-bottom: 1rem;
    outline: none;
    resize: none;
    font-family: inherit;
  }

  textarea:focus {
    border-color: var(--color-tertiary-light);
  }

  button {
    flex-grow: 0;
    text-transform: uppercase;
    padding: 1rem 4rem;
    margin-left: auto;
    background-color: var(--color-secondary);
    color: var(--color-primary);
    border-radius: 0.6rem;
    border: none;
  }

  button:hover {
    box-shadow: 0rem 0.5rem 1rem var(--color-tertiary-trans);
    transform: translateY(-0.2rem);
  }

  button:focus {
    box-shadow: none;
    transform: translateY(0);
  }

  button:disabled {
    box-shadow: none;
    transform: translateY(0);
    background-color: var(--color-tertiary-light);
  }
`;
