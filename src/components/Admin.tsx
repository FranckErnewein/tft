import { FC } from "react";
import { Game, RoundStatus, RoundResult } from "../state";
import { useCommand } from "../hooks";
import startGame from "../commands/startGame";
import startRound from "../commands/startRound";
import endBet from "../commands/endBet";
import endRound from "../commands/endRound";

const Admin: FC<Game> = (game) => {
  const startGameMutation = useCommand(startGame);
  const startRoundMutation = useCommand(startRound);
  const endBetMutation = useCommand(endBet);
  const endRoundMutation = useCommand(endRound);
  return (
    <div>
      <h2>Admin</h2>
      <hr />
      <button
        onClick={() => startGameMutation.mutate({})}
        disabled={startGameMutation.isLoading}
      >
        {game.id ? "reset game" : "start game"}
      </button>
      <hr />
      {game.id && (
        <div>
          {!game.currentRound && (
            <button
              onClick={() => {
                startRoundMutation.mutate({});
              }}
              disabled={startRoundMutation.isLoading}
            >
              start a new round
            </button>
          )}
          {game.currentRound &&
            game.currentRound?.status === RoundStatus.BET_TIME && (
              <button
                onClick={() => {
                  endBetMutation.mutate({});
                }}
                disabled={endBetMutation.isLoading}
              >
                end bet
              </button>
            )}
          {game.currentRound &&
            game.currentRound?.status === RoundStatus.RUNNING && (
              <div>
                <button
                  onClick={() => {
                    endRoundMutation.mutate({ roundResult: RoundResult.WIN });
                  }}
                  disabled={endRoundMutation.isLoading}
                >
                  Round won
                </button>
                <button
                  onClick={() => {
                    endRoundMutation.mutate({ roundResult: RoundResult.LOSE });
                  }}
                  disabled={endRoundMutation.isLoading}
                >
                  Round Lost
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Admin;
