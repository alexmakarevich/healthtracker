import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

export interface WithId {
  _id: string
}

// standard generic apis

export function generateCRUD <Item extends WithId>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });


  const CREATE = async (object: Item) => {
    const { _id, ...objectWithoutMongoId } = object;
    const res = await axiosInstance.post("/add", objectWithoutMongoId);
    // console.log("CREATE result");
    // console.log(res.data);
    return res.data;
  };

  const READ_BY_ID = async (id: string) => {
    const res = await axiosInstance.get(`/${id}`);
    // console.log(res.data);
    return await res.data;
  };

  const READ_ALL = async () => {
    const res = await axiosInstance.get("");
    // console.log(res.data);
    return await res.data;
  };

  const UPDATE_BY_ID = async (object: Item) => {
    const res = await axiosInstance.post(`/update/${object._id}`, object);
    // console.log(res.data);
    return await res.data;
  };

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
