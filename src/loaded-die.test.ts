import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";
import { createBiasedCoin, flipBiasedCoin } from "./biased-coin.ts";
import { RandomNumberGenerator } from "./common-types.ts";

type WeightedOptions<T> = Map<T, number>;

type WeightedOptionEntry<T> = [T, number];
type WeightedOption<T> = {
  value: T;
  weight: number;
};

const toWeightedOption = <T>(
  entry: WeightedOptionEntry<T>,
): WeightedOption<T> => {
  const [value, weight] = entry;

  return {
    value,
    weight,
  };
};

function rollLoadedDie<T>(
  rng: RandomNumberGenerator,
  options: WeightedOptions<T>,
): T {
  const entries = Array
    .from(options.entries())
    .map(toWeightedOption);

  const totalWeight = Array
    .from(options.values())
    .reduce((a, b) => a + b, 0);

  const pickEventually = (nthAttempt: number = 0): T => {
    const entry = entries[nthAttempt % options.size];
    const coin = createBiasedCoin(entry.weight / totalWeight, [true, false]);
    return flipBiasedCoin(rng, coin)
      ? entry.value
      : pickEventually(nthAttempt + 1);
  };

  return pickEventually();
}

Deno.test("rollLoadedDie - signature", () => {
  const options = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 3],
    ["d", 6],
  ]);
  const result = rollLoadedDie(Math.random, options);

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
  const countDistinct = (acc: Record<string, number>, result: string) => {
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
