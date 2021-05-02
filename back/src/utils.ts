import { Model, Document } from "mongoose";

export const isItemFound = (Model: Model<Document, {}>) => async (
  id: string
) => {
  let result: boolean;
  await Model.findById(id, (err, res) => {
    console.log({ err, res });
    result = !!res;
    console.log({ result });
  });
  return result;
};

export const validateIsItemFound = (Model: Model<Document, {}>) => ({
  validator: isItemFound(Model),
  message: (props) =>
    Model.modelName + " with id " + props.value + " doesn't exist",
});
