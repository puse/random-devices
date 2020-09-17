import type {RandomNumberGenerator} from "./common-types.ts";

import type {WeightedOption} from "./weighted-option.ts";

import {
  meanWeightFor,
  popUnderWeight,
  slicePartialOverWeight,
} from "./weighted-option-list.ts";

export const nthBalancedOption = <T>(
  idx: number,
  options: WeightedOption<T>[],
): WeightedOption<T>[] => {
  const meanWeight = meanWeightFor(options);

  const [probe, restOptions] = popUnderWeight(meanWeight, options);

  // if no underweight, then probably it's balanced
  // just return `idx`-th
  if (!probe) {
    return [options[idx]];
  }

  const deltaWeight = meanWeight - probe[1];
  const [complement, restOptions2] = slicePartialOverWeight(
    meanWeight,
    deltaWeight,
    restOptions,
  );

  if (idx === 0) {
    return [probe, complement];
  } else {
    return nthBalancedOption(idx - 1, restOptions2);
  }
};

export function rollLoadedDie<T>(
  rng: RandomNumberGenerator,
  options: WeightedOption<T>[],
): T {
  switch (options.length) {
    case 1:
      // constant
      const [value] = options[0];
      return value;
    case 2:
      // coin logic
      const [[v1, w1], [v2, w2]] = options;
      return rng() < w1 / (w1 + w2) ? v1 : v2;
    default:
      // loaded die logic
      const optionSlot = nthBalancedOption(
        Math.floor(rng() * options.length),
        options,
      );
      return rollLoadedDie(rng, optionSlot);
  }
}
