import { Pair, RandomNumberGenerator, CoinSide } from "./common-types.ts";

/** Pick a side for given index based on ratio */
const sideFor = (ratio: number, index: number): CoinSide => {
  const offset = 1 / (ratio + 1);
  return offset < index ? 0 : 1;
};

/**
 * Pick one *randomly* from given options pair.
 * Choice of option is biased by `ratio`
 *
 *    flipBiasedCoin(Math.random, 2/3, ['a', 'b']);
 */

export function flipBiasedCoin<T>(
  rng: RandomNumberGenerator,
  ratio: number,
  options: Pair<T>,
) {
  return options[sideFor(ratio, rng())];
}
