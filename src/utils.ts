import { ChampionInterface, TraitInterface } from "./types";

export function getChampionImagePath(champion: ChampionInterface): string {
  const fileName = champion.name
    .replace(" ", "")
    .replace("'", "")
    .replace(".", "");
  return `/set6/champions/${fileName}.png`;
}

export function getTraitImagePath(trait: TraitInterface): string {
  const fileName = trait.name.toLowerCase().replace(" ", "");
  return `/set6/traits/${fileName}.png`;
}
