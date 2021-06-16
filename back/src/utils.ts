import { Model, Document } from "mongoose";

export const isItemFound =
  <ModelType = Document>(Model: Model<ModelType, {}>) =>
  async (id: string) => {
    let result: boolean;
    await Model.findById(id, (err, res) => {
      console.log({ err, res });
      result = !!res;
      console.log({ result });
    });
    return result;
  };

export const validateIsItemFound = <ModelType = Document>(
  Model: Model<ModelType, {}>
) => ({
  validator: isItemFound(Model),
  message: (props) =>
    Model.modelName + " with id " + props.value + " doesn't exist",
});
