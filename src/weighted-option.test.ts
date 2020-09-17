import {
  assertEquals,
  assertThrows,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import {
  valueOf,
  splitByWeight,
  weightOf,
  createWeightedOption,
} from "./weighted-option.ts";

Deno.test("createWeightedOption", () => {
  const value = "a";
  const weight = 10;

  const option = createWeightedOption(value, weight);

  assertEquals(valueOf(option), value);
  assertEquals(weightOf(option), weight);
});

Deno.test("splitByWeight", () => {
  const option = createWeightedOption("a", 10);
  const result = splitByWeight(4, option);

  assertEquals(result, [
    createWeightedOption("a", 4),
    createWeightedOption("a", 6),
  ]);
});

Deno.test("splitByWeight - take more", () => {
  const option = createWeightedOption("a", 10);

  assertThrows(() => splitByWeight(20, option));
});
