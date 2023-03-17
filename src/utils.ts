export function promisify<T, U>(func: (x?: T) => U): (x?: T) => Promise<U> {
  return function (x?: T): Promise<U> {
    return Promise.resolve(func(x));
  };
}

export function promisifyToNothing<T>(
  func: (x: T) => void
): (x: T) => Promise<void> {
  return function (x: T): Promise<void> {
    func(x);
    return Promise.resolve();
  };
}

export function promisifyFromAndToNothing(
  func: () => void
): () => Promise<void> {
  return function (): Promise<void> {
    func();
    return Promise.resolve();
  };
}

export function asFunction<T>(x: T): (...args: any[]) => T {
  return () => x;
}

export function identity<T>(): (x: T) => T {
  return (x) => x;
}

export function timestamp(d = new Date()): string {
  return d.toISOString();
}
