import { FC } from "react";
import styled, { keyframes } from "styled-components";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Game, RoundResult, Player, Bet } from "../state";

interface Props {
  game: Game;
}

function win(bet: Bet | undefined) {
  return bet?.expectedResult === RoundResult.WIN;
}

const Content = styled.div`
  position: relative;
  padding: 40px 0;
`;

const Bar = styled.div<Bet>`
  position: absolute;
  top: 10px;
  border-radius: 3px;
  height: 20px;
  margin-left: 23px;
  margin-right: 23px;
  padding: 0 2px;
  color: white;
  text-align: ${(props) => (win(props) ? "right" : "left")};
  width: ${(props) => ((props.amountCents / 1000) * 100) / 2}%;
  ${(props) => (win(props) ? "left" : "right")}: 50%;
  background-color: ${(props) => (win(props) ? "blue" : "purple")};
`;

const AvatarContent = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -20px;
`;

const BetContent = styled.div`
  position: relative;
  height: 40px;
  margin: 3px 0;
`;

const VerticalLine = styled.div`
  position: absolute;
  background-color: #ddd;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  z-index: -1;
`;

const betTimerAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    transform: scale(1);
    opacity: 1;
  }
  15% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
`;

const Timer = styled.div`
  z-index: 1000;
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 50%;
  width: 100px;
  animation: ${betTimerAnimation} 700ms linear both;
  margin-left: -50px;
  text-align: center;
`;

const Bets: FC<Props> = ({ game }) => {
  const totalWin = Object.values(game.currentRound?.bets || {})
    .filter((bet) => bet.expectedResult === RoundResult.WIN)
    .reduce((memo, bet) => memo + bet.amountCents, 0);
  const totalLose = Object.values(game.currentRound?.bets || {})
    .filter((bet) => bet.expectedResult === RoundResult.LOSE)
    .reduce((memo, bet) => memo + bet.amountCents, 0);
  return (
    <Content>
      <VerticalLine />
      {typeof game.currentRound?.betEndTimer === "number" &&
        game.currentRound.betEndTimer > 0 && (
          <Timer key={game.currentRound.betEndTimer}>
            <Typography variant="h2" color="error">
              {Math.round(game.currentRound.betEndTimer / 1000)}
            </Typography>
          </Timer>
        )}
      <Box>
        <Grid container>
          <Grid item xs={6} textAlign="left">
            <Typography variant="overline" color="secondary">
              Total for lose
            </Typography>
            <Typography variant="h3" color="secondary">
              {totalLose / 100}€
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="overline" color="primary">
              Total for win
            </Typography>
            <Typography variant="h3" color="primary">
              {totalWin / 100}€
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {game.currentRound &&
        Object.values(game.players).map((player: Player) => {
          const firstNameLetter = player.name[0] || "X";
          const bet = game.currentRound?.bets[player.id];
          return (
            <BetContent key={player.id}>
              {bet && (
                <Bar {...bet}>
                  <Typography variant="caption">
                    {bet.amountCents / 100} €
                  </Typography>
                </Bar>
              )}
              <AvatarContent>
                <Tooltip
                  title={player.name}
                  placement={win(bet) ? "left" : "right"}
                >
                  <Avatar alt={player.name}>{firstNameLetter}</Avatar>
                </Tooltip>
              </AvatarContent>
            </BetContent>
          );
        })}
    </Content>
  );
};

export default Bets;
