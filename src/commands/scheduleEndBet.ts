import { JTDDataType } from "ajv/dist/jtd";
import { AsyncCommand } from "./types";
import { EventType, BetTimeDecreased, BetTimeEnded } from "../events";
// import { GameError } from "../errors";
import { timestamp, createValidator } from "../utils";

const schema = {
  properties: {
    restTime: { type: "uint16" },
    interval: { type: "uint8" },
  },
} as const;

export type Options = JTDDataType<typeof schema>;
export const validate = createValidator<Options>(schema);

function generateEvent(restTime: number): BetTimeDecreased {
  return {
    type: EventType.BET_TIME_DECREASED,
    datetime: timestamp(),
    payload: { restTime },
  };
}

const scheduleEndBet: AsyncCommand<Options, BetTimeDecreased | BetTimeEnded> = (
  _,
  options: Options,
  emit,
  done
) => {
  validate(options);
  const { restTime, interval } = options;
  emit(generateEvent(options.restTime));
  let eventEmmitedCount = 0;
  let runningInterval = setInterval(() => {
    eventEmmitedCount++;
    const newRestTime = restTime - interval * eventEmmitedCount;
    if (newRestTime > 0) {
      emit(generateEvent(newRestTime));
    } else {
      clearInterval(runningInterval);
    }
  }, interval);
  const runningTimeout = setTimeout(() => {
    emit({
      type: EventType.BET_TIME_ENDED,
      datetime: timestamp(),
      payload: {},
    });
    clearInterval(runningInterval);
    if (done) done();
  }, restTime);
  return () => {
    emit({
      type: EventType.BET_TIME_ENDED,
      datetime: timestamp(),
      payload: {},
    });
    clearTimeout(runningTimeout);
    clearInterval(runningInterval);
  };
};

export default scheduleEndBet;
