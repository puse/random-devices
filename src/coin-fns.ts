import { Pair } from './common-types.ts';

/**
 * Pick a random element from given pair. Choice of option is biased by `ratio`
 *
 *    flipBiasedCoin(0.8, ['a', 'b'], Math.random());
 */

export function flipBiasedCoin<T>(
  ratio: number,
  options: Pair<T>,
  random: number,
) {
  const side = ratio < random ? 0 : 1;
  return options[side];
}
