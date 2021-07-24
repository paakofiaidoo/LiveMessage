// import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props {}

const MenuButton = styled.button<Props>`
  position: relative;
  background-color: transparent;
  width: 4rem;
  height: 4rem;
  padding: 0.9rem;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  &::before,
  &::after {
    content: "";
    width: 0.75rem;
    height: 0.75rem;
    background-color: var(--color-secondary);
    box-shadow: 1.3rem 0rem 0.1rem 0.01rem var(--color-secondary);
  }

  &::before {
    margin-bottom: 0.4rem;
  }

  &:hover {
    &::before,
    &::after {
      /* transform: scale(1.1); */
    }
  }
`;

export default MenuButton;
