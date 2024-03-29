import { FC, useState, useEffect, ChangeEvent } from "react";
import { useCookie } from "react-use";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import startRound, { Options, defaultOptions } from "../../commands/startRound";
import createCommandButton from "../createCommandButton";

const StartRoundButton = createCommandButton<Options>(startRound);

export interface Props {}

function useCookieField(
  cookieName: string,
  defaultValue: string = ""
): [string, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void] {
  const [cookieValue, updateCookie] = useCookie(cookieName);
  const [value, setValue] = useState<string>(cookieValue || defaultValue);

  useEffect(() => {
    if (cookieValue !== value) {
      updateCookie(value);
    }
  }, [value]);
  return [
    value,
    (event): void => {
      setValue(event.target.value);
    },
  ];
}

const StartNewRoundAction: FC<Props> = () => {
  const [question, setQuestion] = useCookieField(
    "rount-question",
    defaultOptions?.question
  );
  const [answerA, setAnswerA] = useCookieField(
    "rount-answer-a",
    defaultOptions?.answerA
  );
  const [answerB, setAnswerB] = useCookieField(
    "rount-answer-b",
    defaultOptions?.answerB
  );

  return (
    <Box>
      <Stack py={1}>
        <TextField
          label="Question"
          variant="outlined"
          value={question}
          onChange={setQuestion}
        />
      </Stack>
      <Grid container spacing={2} py={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Answer B"
            variant="outlined"
            color="secondary"
            value={answerB}
            onChange={setAnswerB}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Answer A"
            color="primary"
            variant="outlined"
            value={answerA}
            onChange={setAnswerA}
          />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="space-between">
        <StartRoundButton options={{ question, answerA, answerB }}>
          Start new round
        </StartRoundButton>
      </Stack>
    </Box>
  );
};

export default StartNewRoundAction;
