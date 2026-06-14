/** Split an array into chunks of the given size. */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Group an array into rows of objects keyed by column index, e.g.
 * gridify(["a","b","c","d"], 3) => [{1:"a",2:"b",3:"c"}, {1:"d"}]
 */
export function gridify<T>(arr: T[], size: number): Record<string, T>[] {
  return chunk(arr, size).map((row) => {
    const obj: Record<string, T> = {};
    row.forEach((value, index) => {
      obj[`${index + 1}`] = value;
    });
    return obj;
  });
}

/**
 * Deterministic pseudo-random generator. Seeding lets us reproduce the same
 * sequence, which keeps puzzle generation idempotent.
 */
export function createRandomGenerator(seed = 1): () => number {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

/** Return a new array shuffled using a seeded random generator. */
export function shuffle<T>(array: T[], seed = 1): T[] {
  const random = createRandomGenerator(seed);
  return array
    .map((value) => ({ value, sort: random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/** Increment any duplicate numbers so the resulting array is strictly unique. */
export function incrementDups(arr: number[]): number[] {
  const seen = new Set<number>();
  return arr.map((num) => {
    while (seen.has(num)) {
      num += 1;
    }
    seen.add(num);
    return num;
  });
}
