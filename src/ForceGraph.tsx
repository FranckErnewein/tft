import { useEffect, useState } from "react";
import * as d3 from "d3";
import useChampionQuery from "./useChampionsQuery";
import useTraitQuery from "./useTraitQuery";
import { getChampionImagePath, getTraitImagePath } from "./utils";
import { filter65Champions } from "./mapper";
import { TraitInterface, ChampionInterface } from "./types";
import { Bubble, BubbleContainer } from "./styled";

interface Node extends d3.SimulationNodeDatum {
  id?: string;
}

export default function ForceGraph() {
  const champions = filter65Champions(useChampionQuery());
  const traits = useTraitQuery();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<d3.SimulationLinkDatum<Node>[]>([]);
  const traitIndexOffset = champions.length ? champions.length - 1 : 0;

  // console.log("traits", traits);
  // console.log("champions", champions);
  useEffect(() => {
    if (traits.length === 0 || champions.length === 0) {
      return;
    }

    const championNodes = champions.map((champion, i) => {
      return {
        group: 1,
        id: champion.championId,
        index: i,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      };
    });

    const traitNodes = traits.map((trait, i) => {
      return {
        group: 2,
        id: trait.name,
        index: i + traitIndexOffset,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      };
    });

    // console.log("traitNodes", traitNodes);
    // console.log("championNodes", championNodes);

    const nodes: Node[] = [...championNodes, ...traitNodes];

    const generatedLinks = champions.reduce<
      { source: string; target: string }[]
    >((memo, champion) => {
      return [
        ...memo,
        ...champion.traits.map((trait) => {
          return {
            source: champion.championId,
            target: trait.replace(" ", ""),
            value: Math.random(),
            force: 5,
          };
        }),
      ];
    }, []);
    // console.log("nodes", nodes);
    // console.log("generatedLinks", generatedLinks);
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3.forceLink(generatedLinks).id((x) => x.id)
      )
      .force("charge", d3.forceManyBody())
      // .force("charge", d3.forceCollide())
      .force("center", d3.forceCenter())
      .on("tick", () => {
        setNodes(nodes);
        setLinks(generatedLinks);
      });
    return () => {
      simulation.stop();
    };
  }, [champions, traits]);

  return (
    <BubbleContainer>
      {nodes.map((node) => {
        return (
          <Bubble
            key={node.index}
            style={{
              backgroundImage: `url(${
                node.index && node.index < traitIndexOffset
                  ? getChampionImagePath(champions[node.index || 0])
                  : getTraitImagePath(
                      traits[(node.index || 0) - traitIndexOffset] || traits[0]
                    )
              })`,
              transform: `translateX(${node.x / 3}px) translateY(${
                node.y / 3
              }px)`,
            }}
          ></Bubble>
        );
      })}
    </BubbleContainer>
  );
}
