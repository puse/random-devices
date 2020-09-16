import type { Pair, RandomNumberGenerator } from "./common-types.ts";

export type BiasedCoin<T> = {
  ratio: number;
  sides: Pair<T>;
};

export function createBiasedCoin<T>(
  ratio: number,
  sides: Pair<T>,
): BiasedCoin<T> {
  return {
    ratio,
    sides,
  };
}

/**
 * Pick one *randomly* from given biased coin.
 * Choice of option is biased by `ratio`
 *
 *    const coin = createBiasedCoin(1 / 3, ['a', 'b']);
 *    flipBiasedCoin(Math.random, coin);
 */

export function flipBiasedCoin<T>(
  rng: RandomNumberGenerator,
  coin: BiasedCoin<T>,
): T {
  const headRange = coin.ratio / (coin.ratio + 1);
  const [head, tail] = coin.sides;
  return rng() < headRange ? head : tail;
}
