import { FC, useState, useEffect } from "react";
import { useCookie } from "react-use";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MoreTimeIcon from "@mui/icons-material/MoreTime";

import scheduleEndBet, { Options } from "../commands/scheduleEndBet";
import endBet from "../commands/endBet";
import createCommandButton from "./createCommandButton";

const ScheduleEndBetButton = createCommandButton<Options>(scheduleEndBet);
const EndBetButton = createCommandButton(endBet);

export interface Props {
  disabled: boolean;
}

const ScheduleEndBetAction: FC<Props> = ({ disabled }) => {
  const [value, updateCookie] = useCookie("bet-timer");
  const [time, setTime] = useState<number>(value ? parseInt(value) : 25);

  useEffect(() => {
    const newValue = time.toString();
    if (value !== newValue) {
      updateCookie(newValue);
    }
  }, [time]);

  const marks = [...Array(31).keys()].map((i) => {
    return {
      value: i,
      label: i % 10 === 0 ? i + "s" : "",
    };
  });

  return (
    <Box width="400px">
      <Stack direction="row" justifyContent="space-between">
        <IconButton
          color="primary"
          aria-label="less time"
          component="label"
          onClick={() => setTime(Math.max(time - 1, 0))}
        >
          <ScheduleIcon />
        </IconButton>
        <Box width="320px">
          <Slider
            min={0}
            step={1}
            value={time}
            marks={marks}
            max={30}
            valueLabelFormat={(value: number) => value + "s"}
            valueLabelDisplay="auto"
            onChange={(_, value: number | number[]) => {
              if (typeof value === "number") {
                setTime(value);
              }
            }}
          />
        </Box>
        <IconButton
          color="primary"
          aria-label="more time"
          component="label"
          onClick={() => setTime(Math.min(time + 1, 30))}
        >
          <MoreTimeIcon />
        </IconButton>
      </Stack>
      <Stack>
        {time > 0 ? (
          <ScheduleEndBetButton
            options={{ restTime: time * 1000, interval: 1000 }}
            disabled={disabled}
          >
            End bets in {time}s
          </ScheduleEndBetButton>
        ) : (
          <EndBetButton>End bets immediatly</EndBetButton>
        )}
      </Stack>
    </Box>
  );
};

export default ScheduleEndBetAction;
