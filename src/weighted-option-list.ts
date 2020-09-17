import type { WeightedOption } from "./weighted-option.ts";

import { weightOf, splitByWeight } from "./weighted-option.ts";

import { popOneBy } from "./common-utils.ts";

export function totalWeightFor<T>(options: WeightedOption<T>[]): number {
  return options
    .map(weightOf)
    .reduce((a, b) => a + b);
}

export function meanWeightFor<T>(options: WeightedOption<T>[]): number {
  return totalWeightFor(options) / options.length;
}

export function popUnderWeight<T>(
  offset: number,
  options: WeightedOption<T>[],
): [WeightedOption<T> | null, WeightedOption<T>[]] {
  return popOneBy((option) => weightOf(option) < offset, options);
}

export function popOverWeightSafe<T>(
  offset: number,
  options: WeightedOption<T>[],
): [WeightedOption<T>, WeightedOption<T>[]] {
  const lteOffset = (option: WeightedOption<T>) => weightOf(option) > offset;
  const [overweight, restOptions] = popOneBy(lteOffset, options);
  if (!overweight) {
    throw new RangeError("No overweight option found");
  }
  return [overweight, restOptions];
}

export function slicePartialOverWeight<T>(
  offset: number,
  deltaWeight: number,
  options: WeightedOption<T>[],
): [WeightedOption<T>, WeightedOption<T>[]] {
  const [overweight, restOptions] = popOverWeightSafe(offset, options);
  const [slice, leftover] = splitByWeight(deltaWeight, overweight);
  return [slice, [leftover, ...restOptions]];
}
