import { assertArrayContains } from "https://deno.land/x/std@0.65.0/testing/asserts.ts";

type LoadedDie<T> = {
  sides: T[],
  loads: number[]
}

function rollLoadedDie<T>(rng: Function, die: LoadedDie<T>): T {
  const idx = Math.floor(rng() * die.sides.length);
  return die.sides[idx];
}

Deno.test('rollLoadedDie - signature', () => {
  const sides = [1, 2, 3, 4, 5, 6]

  const die = {
    sides,
    loads: [1, 2, 3, 4, 5, 6]
  }
  const result = rollLoadedDie(Math.random, die)

  console.log(result)
  assertArrayContains(sides, [result])
})
