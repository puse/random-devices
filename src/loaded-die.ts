import { RandomNumberGenerator } from "./common-types.ts";

type Pred = (...args: any[]) => boolean;

const sliceOneBy = <T>(pred: Pred, arrRef: T[]): [T | null, T[]] => {
  // mutate copy
  const arr = [...arrRef];
  const idx = arr.findIndex(pred);
  if (idx === -1) {
    return [null, arr];
  } else {
    const [el] = arr.splice(idx, 1);
    return [el, arr];
  }
};

export type WeightedOption<T> = [T, number];

function popOverWeight<T>(
  offset: number,
  list: WeightedOption<T>[],
): [WeightedOption<T> | null, WeightedOption<T>[]] {
  return sliceOneBy(([_, weight]) => weight > offset, list);
}

function popUnderWeight<T>(
  offset: number,
  list: WeightedOption<T>[],
): [WeightedOption<T> | null, WeightedOption<T>[]] {
  return sliceOneBy(([_, weight]) => weight < offset, list);
}

export const nthBalancedOption = <T>(
  nth: number,
  options: WeightedOption<T>[],
): WeightedOption<T>[] => {
  const totalWeight = options
    .map(([_, weight]) => weight)
    .reduce((a, b) => a + b);
  const meanWeight = totalWeight / options.length;

  // pick an underweight
  const [probe, restOptions] = popUnderWeight(meanWeight, options);

  if (!probe) {
    return [options[nth]];
  }

  const [donor, restOptions2] = popOverWeight(meanWeight, restOptions);

  if (!donor) {
    throw RangeError("Can not find donor");
  }

  const deltaWeight = meanWeight - probe[1];

  if (nth === 0) {
    const alias = [donor[0], deltaWeight] as WeightedOption<T>;
    return [probe, alias];
  } else {
    const leftover = [donor[0], donor[1] - deltaWeight] as WeightedOption<T>;
    return nthBalancedOption(nth - 1, [...restOptions2, leftover]);
  }
};

export function rollLoadedDie<T>(
  rng: RandomNumberGenerator,
  options: WeightedOption<T>[],
): T {
  switch (options.length) {
    case 1:
      const [value] = options[0];
      return value;
    case 2:
      const [[v1, w1], [v2, w2]] = options;
      return rng() < w1 / (w1 + w2) ? v1 : v2;
    default:
      const slot = nthBalancedOption(
        Math.floor(rng() * options.length),
        options,
      );
      return rollLoadedDie(rng, slot);
  }
}
