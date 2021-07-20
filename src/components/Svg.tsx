import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props {
  iconPath: string;
}

const Svg: FunctionComponent<Props> = ({ iconPath }) => {
  return (
    <Wrapper className="Svg" viewBox="0 0 24 24">
      <use xlinkHref={iconPath} />
    </Wrapper>
  );
};

export default Svg;

const Wrapper = styled.svg`
  height: 2rem;
  /* fill: crimson; */
`;
