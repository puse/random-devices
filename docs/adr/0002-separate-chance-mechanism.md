# 2. Separate chance mechanism

Date: 2020-09-17

## Status

Status: Accepted on 2020-09-19
Previous status: Proposal on 2020-09-17

## Context

We have data like:

``` ts
type WeightedOption<T> = [value: T, weight: number]
```

For most part you need either the `value` or the `weight` .
This isn't very straightforward to work with and pass around.

## Decision

Separate chance mechanism to work only with *weights*.
Handling of corresponding *values* will be done in other layers.

#### Example

``` ts
const rng = Math.random;
const weights = [1, 2, 3];

const idx = randomIndex(rng, weights);
// > 2
```

## Consequences

Will simplify API, aid naming and typing.
