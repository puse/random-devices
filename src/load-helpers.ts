import { sum, and } from "./common-utils.ts";

// helpers

export function nominalLoadFrom(weights: number[]): number[] {
  const mean = weights.reduce(sum, 0) / weights.length;
  return weights.map((x) => x / mean);
}

export function ratiosWithAliases(weights: number[]) {
  const load = nominalLoadFrom(weights);

  const boundedLoad = [];
  const aliases = [];

  const visited = Array.from(load, () => false);

  while (!visited.reduce(and, true)) {
    const lteIdx = load.findIndex((x, i) => x <= 1 && !visited[i]);
    const gteIdx = load.findIndex((x, i) => x >= 1 && !visited[i]);

    visited[lteIdx] = true;
    boundedLoad[lteIdx] = load[lteIdx];
    aliases[lteIdx] = gteIdx;

    if (lteIdx !== gteIdx) {
      load[gteIdx] -= 1 - load[lteIdx];
    }
  }

  return [
    boundedLoad,
    aliases,
  ];
}
