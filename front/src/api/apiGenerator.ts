import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

// standard generic apis

export function generateCRUD <Item>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  type ItemWithId = Item & {
    _id: string
  }

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const CREATE = async (object: ItemWithId) => {
    const { _id, ...objectWithoutMongoId } = object;
    const res = await axiosInstance.post("/add", objectWithoutMongoId);
    // console.log("CREATE result");
    // console.log(res.data);
    return res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const READ_BY_ID = async (id: string) => {
    const res = await axiosInstance.get(`/${id}`);
    // console.log(res.data);
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const READ_ALL = async () => {
    const res = await axiosInstance.get("");
    // console.log(res.data);
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const UPDATE_BY_ID = async (object: ItemWithId) => {
    const res = await axiosInstance.post(`/update/${object._id}`, object);
    // console.log(res.data);
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const DELETE_BY_ID = async (id: string) => {
    const res = await axiosInstance.delete(`/delete/${id}`);
    // console.log(res);
    return res.data;
  };

  return {
    CREATE,
    READ_BY_ID,
    READ_ALL,
    UPDATE_BY_ID,
    DELETE_BY_ID,
  };
}
