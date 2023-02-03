import { FC } from "react";
import styled from "styled-components";
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
  padding: 30px 0;
  margin: 10px 0;
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
  background-color: ${(props) => (win(props) ? "red" : "blue")};
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
      <Box textAlign="center">
        <Typography variant="h3">
          <span style={{ color: "blue" }}>{totalLose / 100}€</span>{" "}
          <span style={{ color: "red" }}>{totalWin / 100}€</span>
        </Typography>
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
