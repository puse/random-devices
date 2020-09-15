import {
  assertArrayContains,
} from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

type Pair<T> = [T, T];

type PickWithRandom<T> = (random: number) => T;

function flipFairCoin<T>(options: Pair<T>, random: number): T; // total
function flipFairCoin<T>(options: Pair<T>): PickWithRandom<T>; // curried

function flipFairCoin<T>(options: Pair<T>, random?: number) {
  const fairRatio = 0.5;

  const pickWithRandom: PickWithRandom<T> = (random: number): T =>
    random > fairRatio ? options[0] : options[1];

  return random ? pickWithRandom(random) : pickWithRandom;
}

Deno.test("flipFairCoin", () => {
  const options = [1, 2] as Pair<number>;

  const assertValidOption = (expected: number, msg?: string) =>
    assertArrayContains(options, [expected], msg);

  assertValidOption(flipFairCoin(options, Math.random()), "total");

  const flipWith = flipFairCoin(options);
  assertValidOption(flipWith(Math.random()), "curried");
  assertValidOption(flipWith(Math.random()), "curried");
});

function flipBiasedCoin<T>(
  ratio: number,
  options: Pair<T>,
  random: number,
): T;

function flipBiasedCoin<T>(
  ratio: number,
  options: Pair<T>,
): PickWithRandom<T>;

function flipBiasedCoin<T>(
  ratio: number,
  options: Pair<T>,
  random?: number,
) {
  const pickWithRandom: PickWithRandom<T> = (random: number): T =>
    random > ratio ? options[0] : options[1];

  return random ? pickWithRandom(random) : pickWithRandom;
}

Deno.test("flipBiasedCoin", () => {
  const options = [1, 2] as Pair<number>;
  const ratio = 0.33;

  const assertValidOption = (expected: number, msg?: string) =>
    assertArrayContains(options, [expected], msg);

  assertValidOption(flipBiasedCoin(ratio, options, Math.random()), "total");

  const flipWith = flipBiasedCoin(ratio, options);
  assertValidOption(flipWith(Math.random()), "curried");
  assertValidOption(flipWith(Math.random()), "curried");
});
