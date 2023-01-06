export interface ChampionInterface {
  name: string;
  championId: string;
  traits: string[];
}

interface SetsListItem {
  max: number;
  min: number;
  style: number;
}

export interface TraitInterface {
  key: string;
  description: string;
  sets: SetsListItem[];
  name: string;
}
