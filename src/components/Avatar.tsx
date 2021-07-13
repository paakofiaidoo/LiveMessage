import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const Avatar: FunctionComponent<Props> = ({ src, alt, className }) => {
  return (
    <Wrapper
      className={"Avatar " + className}
      src={src || "images/default-profile.jpg"}
      alt={alt}
    />
  );
};

export default Avatar;

const Wrapper = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  background-color: var(--color-grey-light);
  background-image: url("images/default-profile.jpg");
  background-position: center;
  background-size: cover;
  color: transparent;
`;
