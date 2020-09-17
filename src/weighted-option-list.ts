import type { WeightedOption } from "./weighted-option.ts";

import { weightOf, splitByWeight } from "./weighted-option.ts";

import { popOneBySafe } from "./common-utils.ts";

export function singleton<T>(option: WeightedOption<T>): [WeightedOption<T>] {
  return [option];
}

export function totalWeightFor<T>(options: WeightedOption<T>[]): number {
  return options
    .map(weightOf)
    .reduce((a, b) => a + b);
}

export function meanWeightFor<T>(options: WeightedOption<T>[]): number {
  return totalWeightFor(options) / options.length;
}

export function popUnderWeightSafe<T>(
  offset: number,
  options: WeightedOption<T>[],
): [WeightedOption<T>, WeightedOption<T>[]] {
  const lt = (option: WeightedOption<T>) => weightOf(option) < offset
  return popOneBySafe(lt, options);
}

export function popOverWeightSafe<T>(
  offset: number,
  options: WeightedOption<T>[],
): [WeightedOption<T>, WeightedOption<T>[]] {
  const gt = (option: WeightedOption<T>) => weightOf(option) > offset;
  return popOneBySafe(gt, options);
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
