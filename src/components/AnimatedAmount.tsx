import { FC, useEffect, useState, useRef } from "react";
import useSpring from "react-use/lib/useSpring";
import { useTween } from "react-use";
import { displayAmount } from "../utils";

interface Props {
  amountCents: number;
}

type RequestAnimationFrameId = ReturnType<typeof requestAnimationFrame>;

const AnimatedAmount: FC<Props> = ({ amountCents }) => {
  const [displayed, setDisplayed] = useState<string>(
    displayAmount(amountCents)
  );
  const prevAmountCents = useRef<number>(amountCents);
  const requestId = useRef<RequestAnimationFrameId>();

  useEffect(() => {
    if (requestId.current) cancelAnimationFrame(requestId.current);
    const startTime = Date.now();
    const startAmount = prevAmountCents.current || 0;
    const delta = -1 * startAmount + amountCents;
    const animationDuration = 350;

    const loop = () => {
      const deltaTime = Date.now() - startTime;
      if (deltaTime < animationDuration) {
        const progress = deltaTime / animationDuration;
        const currentDelta = delta * progress;
        setDisplayed(displayAmount(startAmount + currentDelta));
        requestId.current = requestAnimationFrame(loop);
      } else {
        setDisplayed(displayAmount(amountCents));
      }
    };
    loop();
    prevAmountCents.current = amountCents;
    return () => {
      if (requestId.current) {
        cancelAnimationFrame(requestId.current);
      }
    };
  }, [amountCents]);

  return <>{displayed}</>;
};

export default AnimatedAmount;
