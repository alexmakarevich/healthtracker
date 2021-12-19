/** returns given type but with specified keys made optional */
export declare type PartialPartial<T, Keys extends keyof T> = Omit<T, Keys> & Partial<Pick<T, Keys>>;
export declare type Enummed<T> = T[keyof T];
