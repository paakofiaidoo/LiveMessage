import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { bgImage } from "../data";

interface Props {}

export const BlurBackground = styled.div<Props>`
  position: relative;
  max-width: 600px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url("${bgImage}");
    background-attachment: fixed;
    filter: blur(8px);
  }
`;
