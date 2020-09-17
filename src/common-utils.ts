export type Pred = (...args: any[]) => boolean;

export const popOneBy = <T>(pred: Pred, arrRef: T[]): [T | null, T[]] => {
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
