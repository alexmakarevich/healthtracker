export const updateObject = (object: object) => (
  newProps: Partial<typeof object>
) => ({ ...object, newProps });
