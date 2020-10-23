export const updateObject = <O,>(object: O) => (newProps: Partial<O>) => ({
  ...object,
  ...newProps,
});
