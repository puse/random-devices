import { pair } from './common-utils.ts';
import type { Pair, RandomNumberGenerator } from "./common-types.ts";

import { valueOf, weightOf } from "./weighted-option.ts";
import type { WeightedOption } from "./weighted-option.ts";

import {
  singleton,
  meanWeightFor,
  slicePartialOverWeight,
  popUnderWeightSafe,
} from "./weighted-option-list.ts";
import { flipBiasedCoin } from "./biased-coin.ts";

const nthBalancedOption = <T>(
  idx: number,
  options: WeightedOption<T>[],
): WeightedOption<T>[] => {
  return singleton(options[idx]);
};

const nthUnbalancedOption = <T>(
  idx: number,
  options: WeightedOption<T>[],
): WeightedOption<T>[] => {
  try {
    const meanWeight = meanWeightFor(options);

    const [probe, restOptions] = popUnderWeightSafe(meanWeight, options);

    const deltaWeight = meanWeight - weightOf(probe);
    const [complement, restOptions2] = slicePartialOverWeight(
      meanWeight,
      deltaWeight,
      restOptions,
    );

    if (idx === 0) {
      return pair<WeightedOption<T>>(probe, complement);
    } else {
      return nthUnbalancedOption(idx - 1, restOptions2);
    }
  } catch (err) {
    return nthBalancedOption(idx, options)
  }

};

export function rollLoadedDie<T>(
  rng: RandomNumberGenerator,
  options: WeightedOption<T>[],
): T {
  switch (options.length) {
    case 1:
      // constant
      return valueOf(options[0]);
    case 2:
      return flipBiasedCoin(Math.random, options as Pair<WeightedOption<T>>);
    default:
      // loaded die logic
      const idx = Math.floor(rng() * options.length);
      const optionSlot = nthUnbalancedOption(idx, options);
      return rollLoadedDie(rng, optionSlot);
  }
}
