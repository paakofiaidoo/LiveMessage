import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const Avatar: FunctionComponent<Props> = ({ src, alt, className }) => {
  return (
    <Wrapper className={"Avatar " + className}>
      <img src={src} alt={alt} />
    </Wrapper>
  );
};

export default Avatar;

const Wrapper = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 0.4rem;
  background-color: var(--color-grey-light);
  display: flex;
  justify-content: center;
  align-items: center;
  /* overflow: hidden; */

  background-image: url("/images/default-profile.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    color: transparent;
    border-radius: 0.4rem;
  }

  &.small {
    width: 3rem;
    height: 3rem;
  }

  &.xsmall {
    width: 2.5rem;
    height: 2.5rem;
  }

  &.active {
    /* &::before {
      content: "";
      width: calc(100% + 0.5rem);
      height: calc(100% + 0.5rem);
      background-color: var(--color-tertiary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      border-radius: 0.4rem;
    } */

    &::after {
      content: "";
      width: 0.8rem;
      height: 0.8rem;
      background-color: var(--color-tertiary);
      position: absolute;
      bottom: 0.2rem;
      left: 0.2rem;
      border-radius: 0.4rem;
    }
  }
`;
