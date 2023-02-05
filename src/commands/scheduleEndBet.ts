import { JTDDataType } from "ajv/dist/jtd";
import { AsyncCommand, EmitFunction } from "./types";
import { EventType, BetTimeDecreased, BetTimeEnded } from "../events";
import { GameError } from "../errors";
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

const scheduleBetTime: AsyncCommand<
  Options,
  BetTimeDecreased | BetTimeEnded
> = (state, options: Options, emit, done) => {
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
    done();
  }, restTime);
  return () => {
    clearTimeout(runningTimeout);
    clearTimeout(runningTimeout);
  };
};

export default scheduleBetTime;
