# 2. Use functional utilities lib for TS

Date: 2020-09-17

## Status

Status: Proposal on 2020-09-17

## Context

There is already some amount of common utils, a readily available lib can be useful in further development.

## Decision

Use `fp-ts`.

Import from [SkyPack](https://www.skypack.dev):

```ts
import { array } from 'https://cdn.skypack.dev/fp-ts';
```

## Consequences

Besides providing some necessary utilities to solve problem at hand, this will impact coding paradigm e.g. result in safer code, improved signatures, etc.
