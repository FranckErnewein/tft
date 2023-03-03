export interface Save<T> {
  (key: string, value: T): Promise<undefined>;
}

export interface Load<T> {
  (key: string, value: T): Promise<undefined>;
}
