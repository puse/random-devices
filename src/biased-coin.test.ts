import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { flipBiasedCoin } from "./biased-coin.ts";
import { pair } from "./common-utils.ts";
import { WeightedOption } from "./weighted-option.ts";

Deno.test("flipBiasedCoin - signature", () => {
  const coin = pair<WeightedOption<string>>(["head", 1], ["tail", 4]);

  const assertValidOption = (expected: string, msg?: string) =>
    assertArrayContains(["head", "tail"], [expected], msg);

  assertValidOption(flipBiasedCoin(Math.random, coin));
});

Deno.test("flipBiasedCoin - distribution", () => {
  const coin = pair<WeightedOption<string>>(["head", 1], ["tail", 2]);

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
