import { ChampionInterface } from "./types";

export function filterRealChampions(
  champions: ChampionInterface[]
): ChampionInterface[] {
  return champions.filter((champion) => champion.traits.length > 0);
}

export function filter65Champions(
  champions: ChampionInterface[]
): ChampionInterface[] {
  return champions.filter(
    (champion) =>
      champion.traits.length > 0 &&
      [
        "Veigar",
        "Graves",
        "Katarina",
        "Lux",
        "Yone",
        "Yuumi",
        "Lissandra",
        "Dr. Mundo",
        "Twisted Fate",
        "Kog'Maw",
        "Sion",
        "Garen",
        "Fiora",
        "Heimerdinger",
        "Tristana",
        "Janna",
        "Urgot",
        "Taric",
        "Shaco",
        "Akali",
      ].indexOf(champion.name) === -1
  );
}
