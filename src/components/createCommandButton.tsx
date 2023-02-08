import { FC, ReactNode } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { DefaultOption, Command, AsyncCommand } from "../commands/types";
import { BaseEvent, GameEvent } from "../events";
import { useCommand, CommandResponsePayload } from "../hooks";
import ErrorToaster from "./ErrorToaster";

interface CommandOptionsProps<O, E> {
  options?: O;
  children?: ReactNode;
  onSuccess?: (event: E) => void;
  color?:
    | "error"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "inherit";
  variant?: "outlined" | "text" | "contained";
  disabled?: boolean;
  icon?: ReactNode;
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
    icon,
  }) => {
    const { mutate, isLoading, error } = useCommand<O, E>(command, {
      onSuccess: (json: CommandResponsePayload<E>) => {
        if (json.type === "event" && onSuccess) onSuccess(json.event);
      },
    });
    const opt = options as O;
    return (
      <>
        <Button
          variant={variant}
          color={color}
          onClick={() => {
            mutate(opt);
          }}
          disabled={isLoading || disabled}
          endIcon={isLoading ? <CircularProgress /> : icon}
        >
          {children}
        </Button>
        <ErrorToaster error={error} />
      </>
    );
  };
  return comp;
}
