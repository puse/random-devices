export type WeightedOption<T> = [T, number];

export function createWeightedOption<T>(
  value: T,
  weight: number,
): WeightedOption<T> {
  return [value, weight];
}

export function valueOf<T>(option: WeightedOption<T>): T {
  return option[0];
}

export function weightOf(option: WeightedOption<any>): number {
  return option[1];
}

export function withWeight<T>(
  weight: number,
  option: WeightedOption<T>,
): WeightedOption<T> {
  return [valueOf(option), weight];
}

export function splitByWeight<T>(
  deltaWeight: number,
  option: WeightedOption<T>,
): WeightedOption<T>[] {
  if (weightOf(option) < deltaWeight) {
    throw new RangeError(`Can't take away ${deltaWeight}`);
  }

  return [
    withWeight(deltaWeight, option),
    withWeight(weightOf(option) - deltaWeight, option),
  ];
}
