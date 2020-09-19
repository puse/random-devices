import { assertEquals } from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { nominalLoadFrom, ratiosWithAliases } from "./load-helpers.ts";

Deno.test("loadNominal", () => {
  assertEquals(
    nominalLoadFrom([]),
    [],
    "empty",
  );

  assertEquals(
    nominalLoadFrom([5]),
    [1],
    "singleton",
  );

  assertEquals(
    nominalLoadFrom([2, 3]),
    [0.8, 1.2],
    "pair",
  );

  assertEquals(
    nominalLoadFrom([2, 6, 4]),
    [0.5, 1.5, 1],
    "triple",
  );
});

Deno.test("loadBoundWithAliases", () => {
  const weights = [3, 4, 5];

  const [ratios, aliases] = ratiosWithAliases(weights);

  const totalRatios = ratios.reduce(
    (acc, x, i) => {
      acc[i] += x;
      acc[aliases[i]] += 1 - x;
      return acc;
    },
    Array.from(ratios, () => 0),
  );

  assertEquals(nominalLoadFrom(weights), totalRatios, "same in summary");
});
