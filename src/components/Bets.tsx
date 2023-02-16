import { FC } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Timer from "./Timer";
import { Game, RoundResult, Player, Bet } from "../state";
import { displayAmount } from "../utils";

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
          <Timer time={game.currentRound.betEndTimer} />
        )}
      <Box>
        <Grid container>
          <Grid item xs={6} textAlign="left">
            <Typography variant="overline" color="secondary">
              Total for lose
            </Typography>
            <Typography variant="h3" color="secondary">
              {displayAmount(totalLose)}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="overline" color="primary">
              Total for win
            </Typography>
            <Typography variant="h3" color="primary">
              {displayAmount(totalWin)}
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
                    {displayAmount(bet.amountCents)}
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
