import { FC, useState } from "react";
import AnimatedAmount from "../components/AnimatedAmount";

const AnimatedAmountStory: FC = () => {
  const [amount, setAmount] = useState<number>(100);
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          if (e.target.value) {
            setAmount(parseInt(e.target.value, 10));
          }
        }}
      />
      <br />
      <br />
      <AnimatedAmount amountCents={amount} />
    </div>
  );
};

export default AnimatedAmountStory;
