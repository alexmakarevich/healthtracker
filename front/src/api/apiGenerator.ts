import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

// standard generic apis

export function generateCRUD(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const CREATE = async (object: any) => {
    const { _id, ...objectWithoutMongoId } = object;
    const res = await axiosInstance.post("/add", objectWithoutMongoId);
    console.log(res.data);
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const READ_BY_ID = async (id: number | string) => {
    const res = await axiosInstance.get(`/${id}`);
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const READ_ALL = async () => {
    const res = await axiosInstance.get("");
    return await res.data;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const UPDATE_BY_ID = async (object: any) => {
    const res = await axiosInstance.post(`/update/${object._id}`, object);
    return res;
  };

  // TODO would be nice to bolt type inference from given object onto this. Unsure how well it'd work statically though. Might just move the 'any' type one step behind.
  const DELETE_BY_ID = async (id: number | string) => {
    const res = await axiosInstance.delete(`/delete/${id}`);
    return res;
  };

  return {
    CREATE,
    READ_BY_ID,
    READ_ALL,
    UPDATE_BY_ID,
    DELETE_BY_ID,
  };
}
