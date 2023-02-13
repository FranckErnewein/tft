import { FC } from "react";
import styled, { keyframes } from "styled-components";
import Typography from "@mui/material/Typography";

interface Props {
  time: number;
}

const fadeOutAnim = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const scaleOutAnim = keyframes`
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    transform: scale(1);
    opacity: 1;
  }
  15% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
`;

const AnimatedNumber = styled.div<{ scaleOut: boolean }>`
  z-index: 1000;
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 50%;
  width: 100px;
  animation: ${(props) => (props.scaleOut ? scaleOutAnim : fadeOutAnim)} 700ms
    linear both;
  margin-left: -50px;
  text-align: center;
`;

type Variant = "h1" | "h2" | "h3" | "h4";

const Timer: FC<Props> = ({ time }) => {
  const scaleOut = time < 5001;
  let color;
  let variant: Variant = "h4";
  if (time < 10001) {
    color = "secondary";
    variant = "h3";
  }
  if (time < 5001) {
    color = "error";
    variant = "h2";
  }
  return (
    <>
      <AnimatedNumber key={time} scaleOut={scaleOut}>
        <Typography variant={variant} color={color}>
          {Math.round(time / 1000)}
        </Typography>
      </AnimatedNumber>
    </>
  );
};

export default Timer;
