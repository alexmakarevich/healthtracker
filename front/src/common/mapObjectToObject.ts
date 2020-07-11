export function srcPropToResProp(
  srcProp: string,
  srcVal: any,
  propMap: PropMap
) {
  const resPropIndex = propMap.sourceProps.findIndex(
    (prop: string) => prop === srcProp
  );
  const resProp = propMap.resultPprops[resPropIndex];
  const resVal = srcVal;
  const result = resProp === undefined ? [null, null] : [resProp, resVal];
  return result;
}

function mapObjectToObject(sourceObject: object, propMap: PropMap) {
  const objectArray = Object.entries(sourceObject);
  const newObjectArray = objectArray.map(([property, value]) =>
    srcPropToResProp(property, value, propMap)
  );
  const resultObject = Object.fromEntries(newObjectArray);
  return resultObject;
}

const propMap: PropMap = {
  sourceProps: ["title", "ingredientIds"],
  resultPprops: ["title", "ingredient_ids"],
};

interface PropMap {
  sourceProps: string[];
  resultPprops: string[];
}

console.log(
  "testing propmapper",
  srcPropToResProp("ingredientIds", "Mock Title", propMap)
);

console.log(
  "testing object mapper",
  mapObjectToObject({ title: "some title", ingredientIds: [2, 3, 7] }, propMap)
);
