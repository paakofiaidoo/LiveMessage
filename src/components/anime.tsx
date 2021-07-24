import { css, Keyframes, keyframes } from "styled-components";

export const fadeDown = keyframes`
  0%{
    opacity: 0;
    transform: translateY(-50%);
  }
  100%{
    opacity: 1;
    transform: translateY(0%);
  }
`;

export const fadeUp = keyframes`
  0%{
    opacity: 0;
    transform: translateY(50%);
  }
  100%{
    opacity: 1;
    transform: translateY(0%);
  }
`;

export const fadeIn = keyframes`
  0%{
    opacity: 0;
    transform: scale(0.8);
  }
  100%{
    opacity: 1;
    transform: scale(1);
  }
`;

export const fadeOut = keyframes`
  0%{
    opacity: 1;
    transform: scale(1);
  }
  100%{
    opacity: 0;
    transform: scale(0.8);
  }
`;

export const softClose = (from: string, to?: string) => keyframes`
  0%{
    width: ${from};
  }
  100%{
    width: ${to || "auto"};
  }
`;

interface AnimeProps {
  name: Keyframes;
  duration?: number;
  delay?: number;
}

/** Duration and Delay are in seconds */
export const anime = ({ name, duration, delay }: AnimeProps) => css`
  animation-name: ${name};
  animation-delay: ${delay || 0}s;
  animation-timing-function: ease-out;
  animation-duration: ${duration || 1}s;
  animation-fill-mode: both;
`;
