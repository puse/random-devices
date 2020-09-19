import type { NonEmptyList, RNG } from "./common-utils.ts";

import { ratiosWithAliases } from "./load-helpers.ts";

type Weight = number;
type WeightedOptions<T> = Map<T, Weight>;
type WeightIndex = NonEmptyList<Weight>;

const randomLoaded = (rng: RNG, load: WeightIndex): number => {
  const [ratios, aliases] = ratiosWithAliases(load);

  // fair die mechanism
  const slotIdx = Math.floor(rng() * load.length);
  // biased coin mechanism
  return rng() < ratios[slotIdx] ? slotIdx : aliases[slotIdx];
};

export function rollLoadedDie<T>(
  rng: RNG,
  weightedOptions: WeightedOptions<T>,
): T {
  const options = [...weightedOptions.keys()];
  const weights = [...weightedOptions.values()] as WeightIndex;

  return options[randomLoaded(rng, weights)];
}
