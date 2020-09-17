import {
  assertArrayContains,
  assertEquals,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { createWeightedOption } from "./weighted-option.ts";
import { slicePartialOverWeight } from "./weighted-option-list.ts";

Deno.test("slicePartialOverWeight", () => {
  const options = [
    createWeightedOption("a", 1),
    createWeightedOption("b", 5),
  ];

  const [slice, rest] = slicePartialOverWeight(3, 2, options);

  assertEquals(slice, createWeightedOption("b", 2));
  assertArrayContains(rest, [
    createWeightedOption("a", 1),
    createWeightedOption("b", 3),
  ]);
});
