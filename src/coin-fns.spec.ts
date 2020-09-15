import {
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

type Pair<T> = [T, T];

type PickWithRandom<T> = (random: number) => T;

function flipFairCoin<T>(options: Pair<T>, random: number): T; // full
function flipFairCoin<T>(options: Pair<T>): PickWithRandom<T>; // curried

function flipFairCoin<T>(options: Pair<T>, random?: number) {
  const fairRatio = 0.5;

  const pickWithRandom = (random: number) =>
    random > fairRatio ? options[0] : options[1];

  return random ? pickWithRandom(random) : pickWithRandom;
}

Deno.test("flipFairCoin", () => {
  const options = [1, 2] as Pair<number>;

  const assertValidOption = (expected: number, msg?: string) =>
    assertArrayContains(options, [expected], msg);

  assertValidOption(flipFairCoin(options, Math.random()), "total args");

  const flipWith = flipFairCoin(options);
  assertValidOption(flipWith(Math.random()), "curried");
  assertValidOption(flipWith(Math.random()), "curried");
});
