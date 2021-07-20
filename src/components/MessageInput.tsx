import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { ChatRef } from "../services/chat/types";
import { useActor } from "@xstate/react";
import Svg from "./Svg";

interface Props {
  chatRef: ChatRef;
}

const MessageInput: FunctionComponent<Props> = ({ chatRef }) => {
  const [{ context }, send] = useActor(chatRef);

  return (
    <Wrapper className="message-input">
      <textarea
        name="message"
        placeholder="Enter your reply here..."
        onChange={(e) => send({ type: "CHANGE", value: e.target.value })}
        value={context.message}
      ></textarea>
      <button title="Send" onClick={() => send({ type: "SEND" })}>
        <Svg iconPath="/icons/sprite.svg#send" />
      </button>
    </Wrapper>
  );
};

export default MessageInput;

const Wrapper = styled.div`
  width: 100%;
  height: 8rem;
  display: flex;
  flex-grow: 0;
  padding: 1rem 2rem;

  textarea {
    height: 100%;
    padding: 1rem;
    border-radius: 0.6rem;
    border: 0.2rem solid #dbdcde;
    margin-bottom: 1rem;
    outline: none;
    resize: none;
    font-family: inherit;
    flex-grow: 1;
  }

  textarea:focus {
    border-color: var(--color-tertiary-light);
  }

  button {
    flex-grow: 0;
    width: 4rem;
    height: 100%;
    margin-left: 0.5rem;
    background-color: transparent;
    border: none;
    outline: none;

    svg {
      transition: transform 0.3s ease-out, fill 0.1s ease-out;
    }

    &:focus {
      outline: none;

      svg {
        fill: var(--color-tertiary);
      }
    }

    &:hover {
      svg {
        fill: var(--color-tertiary);
        transform: scale(1.1);
      }
    }

    &:disabled {
      box-shadow: none;
      transform: translateY(0);
      background-color: var(--color-tertiary-light);
    }
  }
`;
