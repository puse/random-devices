import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import type { NonEmptyList, RNG } from "./common-utils.ts";

//

// --

function randomLoaded(rng: RNG, load: NonEmptyList<number>): number {
  const [ratios, aliases] = ratiosWithAliases(load)

  const slotIdx = Math.floor(rng() * load.length);
  return rng() < ratios[slotIdx] ? slotIdx : aliases[slotIdx]
}

function ratiosWithAliases(weights: number[]) {
  const mean = weights.reduce((a, b) => a + b) / weights.length;
  const load = weights.map((x) => x / mean);

  const boundedLoad = [];
  const aliases = [];

  const visited = Array.from(load, () => false)

  for (let i = 0; i < load.length; i++) {
    const lteIdx = load.findIndex((x, i) => x <= 1 && !visited[i]);
    const gteIdx = load.findIndex((x, i) => x >= 1 && !visited[i]);

    visited[lteIdx] = true
    boundedLoad[lteIdx] = load[lteIdx];
    aliases[lteIdx] = gteIdx;

    if (lteIdx !== gteIdx) {
      load[gteIdx] -= 1 - load[lteIdx];
    }
  }

  return [
    boundedLoad,
    aliases,
  ];
}

// --

function rollLoadedDie<A>(rng: RNG, weightedOptions: Map<A, number>): A {
  const options = [...weightedOptions.keys()]
  const weights = [...weightedOptions.values()] as NonEmptyList<number>

  return options[randomLoaded(rng, weights)];
}

// --

Deno.test("rollLoadedDie - signature", () => {
  const options = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 3],
    ["d", 4],
  ]);

  const result = rollLoadedDie(Math.random, options);

  console.log(">", result);

  assertArrayContains(Array.from(options.keys()), Array.of(result));
});

Deno.test("rollLoadedDie - distribution", () => {
  const options = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 3],
    ["d", 6],
  ]);
  const rollOnce = () => rollLoadedDie(Math.random, options);
  const results = Array.from(new Array(1000), rollOnce);

  // aggregate stats
  const countDistinct = (acc: Record<string, number>, result: any) => {
    if (acc[result] === undefined) {
      acc[result] = 0;
    }
    acc[result]++;
    return acc;
  };
  const stats = results.reduce(countDistinct, {});
  // print for visual inspection
  console.log("\n");
  console.table(stats);

  assert(true);
});
