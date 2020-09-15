import {
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
