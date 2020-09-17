import {
  assert,
  assertArrayContains,
  assertEquals,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

import { popOneBy } from "./common-utils.ts";

Deno.test("popOneBy", () => {
  const checkEven = (n: number) => n % 2 === 0;
  const list = [1, 2, 3, 4];

  const [one, rest] = popOneBy(checkEven, list);

  assertArrayContains(list, [one]);
  assert(one && checkEven(one));

  assertArrayContains(list, rest);
  assertEquals(rest.length, list.length - 1);
});
