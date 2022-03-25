export const arrayEquals = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((_, i) => a[i] === b[i]);

export const pickRandom = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length; i--; ) {
    const j = Math.floor(Math.random() * i);

    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};