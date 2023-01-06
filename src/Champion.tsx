import { FunctionComponent } from "react";
import { ChampionInterface } from "./types";
import { getChampionImagePath } from "./utils";
import styled from "styled-components";

export interface Props {
  champion: ChampionInterface;
}

const Content = styled.div`
  width: 64px;
  height: 64px;
  background-size: cover;
  background-position: right center;
  position: relative;
  cursor: pointer;
  transition: transform 0.15s;

  :hover {
    transform: scale(1.1);
  }

  span {
    display: block;
    font-size: 11px;
    color: white;
    position: absolute;
    text-align: center;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
`;

const ChampionComponent: FunctionComponent<Props> = ({ champion }) => {
  return (
    <Content
      key={champion.championId}
      style={{ backgroundImage: `url(${getChampionImagePath(champion)})` }}
    >
      <span>{champion.name}</span>
    </Content>
  );
};

export default ChampionComponent;
