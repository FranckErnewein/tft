import { FC, ReactNode } from "react";
import Button from "@mui/material/Button";

import { DefaultOption, Command, AsyncCommand } from "../commands/types";
import { BaseEvent, GameEvent } from "../events";
import { useCommand, CommandResponsePayload } from "../hooks";
import ErrorToaster from "./ErrorToaster";

interface CommandOptionsProps<O, E> {
  options?: O;
  children?: ReactNode;
  onSuccess?: (event: E) => void;
  color?: "error" | "primary" | "secondary" | "success" | "info" | "warning";
  variant?: "outlined" | "text" | "contained";
  disabled?: boolean;
}

export default function createCommandButton<
  O extends DefaultOption = undefined,
  E extends BaseEvent = GameEvent
>(command: Command<O> | AsyncCommand<O, E>): FC<CommandOptionsProps<O, E>> {
  const comp: FC<CommandOptionsProps<O, E>> = ({
    options = {},
    onSuccess,
    children,
    color,
    variant = "contained",
    disabled = false,
  }) => {
    const { mutate, isLoading, error } = useCommand<O, E>(command);
    const opt = options as O;
    return (
      <>
        <Button
          variant={variant}
          color={color}
          onClick={() =>
            mutate(opt, {
              onSuccess: (json: CommandResponsePayload<E>) => {
                if (json.type === "event" && onSuccess) onSuccess(json.event);
              },
            })
          }
          disabled={isLoading || disabled}
        >
          {children}
        </Button>
        <ErrorToaster error={error} />
      </>
    );
  };
  return comp;
}
