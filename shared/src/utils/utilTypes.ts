/** returns given type but with specified keys made optional */
export type PartialPartial<T, Keys extends keyof T> = Omit<T, Keys> &
  Partial<Pick<T, Keys>>;

export type Enummed<T> = T[keyof T];
