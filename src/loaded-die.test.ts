import {
  assert,
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";
import { createBiasedCoin, flipBiasedCoin } from "./biased-coin.ts";
import { RandomNumberGenerator } from "./common-types.ts";

type LoadedDie<T> = {
  sides: T[];
  loads: number[];
};

function rollLoadedDie<T>(rng: RandomNumberGenerator, die: LoadedDie<T>): T {
  let idx = 0;
  let selection;

  const totalLoad = die.loads.reduce((a, b) => a + b, 0);

  do {
    idx++;
    if (idx === die.sides.length) {
      idx = 0;
    }

    const ratio = die.loads[idx] / totalLoad;
    const coin = createBiasedCoin<boolean>(ratio, [true, false]);

    if (flipBiasedCoin(rng, coin)) {
      selection = die.sides[idx];
    }
  } while (selection === undefined);

  return die.sides[idx];
}

Deno.test("rollLoadedDie - signature", () => {
  const sides = [1, 2, 3, 4, 5, 6];

  const die = {
    sides,
    loads: [1, 2, 3, 4, 5, 6],
  };
  const result = rollLoadedDie(Math.random, die);

  assertArrayContains(sides, [result]);
});

Deno.test("rollLoadedDie - distribution", () => {
  const die = {
    sides: [1, 2, 3, 4, 5, 6],
    loads: [1, 2, 3, 5, 8, 13],
  };

  const rollOnce = () => rollLoadedDie(Math.random, die);
  const results = Array.from(new Array(1000), rollOnce);

  // aggregate stats
  const countDistinct = (acc: Record<string, number>, result: number) => {
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
