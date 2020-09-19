export type RNG = () => number;

export type NonEmptyList<T> = [T, ...T[]];

// utils

type Sum = (a: number, b: number) => number;
export const sum: Sum = (a, b) => a + b;

type And = (a: boolean, b: boolean) => boolean;
export const and: And = (a, b) => a && b;
