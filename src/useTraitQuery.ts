import { useQuery } from "react-query";
import { TraitInterface } from "./types";

export default function useTraitQuery(): TraitInterface[] {
  const { data } = useQuery<TraitInterface[], Error>("traits", () =>
    fetch("/set6/traits.json").then((r) => r.json())
  );
  return data || [];
}
