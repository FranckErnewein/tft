import { useQuery } from "react-query";
import { ChampionInterface } from "./types";

export default function useChampionQuery(): ChampionInterface[] {
  const { data } = useQuery<ChampionInterface[], Error>("champions", () =>
    fetch("/set6/champions.json").then((r) => r.json())
  );
  return data || [];
}
