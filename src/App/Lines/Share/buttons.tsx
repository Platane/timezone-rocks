import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { accentColor } from "../../theme";

export const Button = styled.a`
  text-decoration: none;
  display: inline-block;
  border-radius: 4px;
  border: solid 2px ${accentColor};
  width: 38px;
  height: 28px;
  margin: 2px 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: #3332;
  color: ${accentColor};
  font-size: 0.8em;
`;

export const appearAnimation = css`
  animation-duration: 440ms;

  &:nth-child(1) {
    animation-name: animation1;
    @keyframes animation1 {
      0% {
        transform: scale(0);
      }
      33% {
        transform: scale(0);
      }
      66% {
        transform: scale(1);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  &:nth-child(2) {
    animation-name: animation2;
    @keyframes animation2 {
      0% {
        transform: scale(0);
      }
      33% {
        transform: scale(0);
      }
      66% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
  }
`;

export const disappearAnimation = css`
  transform: scale(0);
  animation-duration: 120ms;

  &:nth-child(1) {
    animation-name: animation1;
    @keyframes animation1 {
      0% {
        transform: scale(1);
      }
      40% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
  }

  &:nth-child(2) {
    animation-name: animation2;
    @keyframes animation2 {
      0% {
        transform: scale(1);
      }
      60% {
        transform: scale(0);
      }
      100% {
        transform: scale(0);
      }
    }
  }
`;
