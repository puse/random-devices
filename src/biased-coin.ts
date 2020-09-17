import type { Pair, RandomNumberGenerator } from "./common-utils.ts";

import type { WeightedOption } from "./weighted-option.ts";

/**
 * Pick one *randomly* from given biased coin.
 * Choice of option is biased by `ratio`
 *
 *    const coin = createBiasedCoin(['head', 3], ['tail', 4]);
 *    flipBiasedCoin(Math.random, coin);
 */

export function flipBiasedCoin<T>(
  rng: RandomNumberGenerator,
  options: Pair<WeightedOption<T>>,
): T {
  // coin logic
  const [[v1, w1], [v2, w2]] = options;
  return rng() < w1 / (w1 + w2) ? v1 : v2;
}
