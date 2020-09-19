import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { rollLoadedDie } from "./loaded-die.ts";

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
