import { FC, ReactNode } from "react";
import Button from "@mui/material/Button";

import { DefaultOption, Command } from "../commands/types";
import { BaseEvent, GameEvent } from "../events";
import { useCommand, CommandResponsePayload } from "../hooks";
import ErrorToaster from "./ErrorToaster";

export default function createCommandButton<
  O extends DefaultOption = undefined,
  E extends BaseEvent = GameEvent
>(
  command: Command<O>
): FC<{ options?: O; children?: ReactNode; onSuccess?: (event: E) => void }> {
  return function ({ options, onSuccess, children }) {
    const mutation = useCommand<O, E>(command);
    return (
      <>
        <Button
          variant="outlined"
          onClick={() =>
            mutation.mutate(options, {
              onSuccess: (json: CommandResponsePayload<E>) => {
                if (json.type === "event" && onSuccess) onSuccess(json.event);
              },
            })
          }
          disabled={mutation.isLoading}
        >
          {children}
        </Button>
        <ErrorToaster error={mutation.error} />
      </>
    );
  };
}
