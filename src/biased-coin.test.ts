import {
  assert,
  assertArrayContains,
  assertEquals,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import type { Pair } from "./common-types.ts";
import { createBiasedCoin, flipBiasedCoin } from "./biased-coin.ts";

Deno.test("createBiasedCoin - signature", () => {
  const sides = ["head", "tail"] as Pair<string>;
  const ratio = 1 / 4;

  const coin = createBiasedCoin(ratio, sides);

  assertEquals(coin.ratio, ratio);
  assertEquals(coin.sides, sides);
});

Deno.test("flipBiasedCoin - signature", () => {
  const coin = createBiasedCoin(1 / 4, ["head", "tail"]);

  const assertValidOption = (expected: string, msg?: string) =>
    assertArrayContains(coin.sides, [expected], msg);

  assertValidOption(flipBiasedCoin(Math.random, coin));
});

Deno.test("flipBiasedCoin - distribution", () => {
  const coin = createBiasedCoin(1 / 4, ["head", "tail"]);
  const flipOnce = () => flipBiasedCoin(Math.random, coin);
  const results = Array.from(new Array(100), flipOnce);
  // aggregate stats
  const countDistinct = (acc: Record<string, number>, result: string) => {
    acc[result]++;
    return acc;
  };
  const stats = results.reduce(countDistinct, { tail: 0, head: 0 });
  // print for visual inspection
  console.log("\n");
  console.table(stats);
  // check (rought)
  assert(stats.head < stats.tail);
});
