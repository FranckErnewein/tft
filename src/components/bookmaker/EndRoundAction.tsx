import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RoundResult, Round } from "../../state";
import endRound, { Options } from "../../commands/endRound";
import createCommandButton from "../createCommandButton";

const EndRoundButton = createCommandButton<Options>(endRound);

const EndRoundAction: FC<Round> = ({ question, answerA, answerB }) => {
  return (
    <>
      <Box>
        <Typography variant="overline">{question}</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between">
        <EndRoundButton
          color="secondary"
          options={{ roundResult: RoundResult.ANSWER_B }}
        >
          {answerB}
        </EndRoundButton>
        <EndRoundButton options={{ roundResult: RoundResult.ANSWER_A }}>
          {answerA}
        </EndRoundButton>
      </Box>
    </>
  );
};

export default EndRoundAction;
