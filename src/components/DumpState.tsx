import { FC } from "react";
import { Game } from "../state";

export interface Props {
  game: Game;
}

const DumpState: FC<Props> = ({ game }) => {
  return <pre>{JSON.stringify(game, null, 2)}</pre>;
};

export default DumpState;
