import { RandomNumberGenerator } from "./common-types.ts";

export const makeTable = (options: [unknown, number][]) => {
  const card = options.length;

  const totalWeight = options
    .map(([_, weight]) => weight)
    .reduce((a, b) => a + b);
  const meanWeight = totalWeight / card;

  const acc = [];

  while (acc.length < card) {
    const probeIdx = options.findIndex(([_, weight]) => weight < meanWeight);

    // only exact left
    if (probeIdx === -1) {
      return [...acc, ...options.map((x) => [x])];
    }

    const [probe] = options.splice(probeIdx, 1);

    const deltaWeight = meanWeight - probe[1];

    const donorIdx = options.findIndex(([_, weight]) => weight > meanWeight);
    const [donor] = options.splice(donorIdx, 1);

    const alias = [donor[0], deltaWeight] as [unknown, number];
    const leftover = [donor[0], donor[1] - deltaWeight] as [unknown, number];

    acc.push([probe, alias]);
    options.push(leftover);
  }

  return acc;
};

export function rollLoadedDie(
  rng: RandomNumberGenerator,
  options: Map<unknown, number>,
): unknown {
  const entries = Array.from(options.entries());

  const card = entries.length;

  if (card === 1) {
    const [value] = entries[0];
    return value;
  }

  if (card === 2) {
    const [[v1, w1], [v2, w2]] = entries;
    return rng() < w1 / (w1 + w2) ? v1 : v2;
  }

  const balancedSlots = makeTable(entries);
  const slotIdx = Math.floor(rng() * card);

  return rollLoadedDie(rng, new Map(balancedSlots[slotIdx]));
}
