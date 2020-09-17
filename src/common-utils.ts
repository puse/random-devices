export type Pair<T> = [T, T];

export type Pred = (...args: any[]) => boolean;

export function pair<T>(fst: T, snd: T): Pair<T> {
  return [fst, snd];
}

export function singleton<T>(value: T): [T] {
  return [value];
}

export const popOneBySafe = <T>(pred: Pred, arrRef: T[]): [T, T[]] => {
  // mutate copy
  const arr = [...arrRef];
  const idx = arr.findIndex(pred);

  if (idx === -1) {
    throw new RangeError(`Not found by given predicate`);
  }

  const [el] = arr.splice(idx, 1);
  return [el, arr];
};

export type RandomNumberGenerator = () => number;
