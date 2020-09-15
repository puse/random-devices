import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { Pair } from "./common-types.ts";
import { flipBiasedCoin } from "./coin-fns.ts";

Deno.test("flipBiasedCoin - signature", () => {
  const options = [1, 2] as Pair<number>;
  const ratio = 0.33;

  const assertValidOption = (expected: number, msg?: string) =>
    assertArrayContains(options, [expected], msg);

  assertValidOption(flipBiasedCoin(ratio, options, Math.random()));
});

Deno.test("flipBiasedCoin - distribution", () => {
  const flip = () => flipBiasedCoin(0.66, ["a", "b"], Math.random());
  const results = Array.from(new Array(100), flip)

  const countDistinct = (acc: Record<string, number>, option: string) => {
    acc[option]++;
    return acc;
  };
  const stats = results.reduce(countDistinct, { a: 0, b: 0});

  assert(stats.a < stats.b)

  console.log('\n')
  console.table(stats)
});
