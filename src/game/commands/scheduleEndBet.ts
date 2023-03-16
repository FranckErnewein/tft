import { JTDDataType } from "ajv/dist/jtd";
import { timestamp, createValidator } from "../../utils";
import { GameAsyncCommand } from "../types";
import { EventType, BetTimeDecreased, BetTimeEnded } from "../events";

const schema = {
  properties: {
    restTime: { type: "uint16" },
    interval: { type: "uint16" },
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

const scheduleEndBet: GameAsyncCommand<
  Options,
  BetTimeDecreased | BetTimeEnded
> = (_, options, emit, done) => {
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
    done();
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
