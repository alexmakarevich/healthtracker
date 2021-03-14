import axios from "axios";
import { WithId } from "../common/types/types";

// standard generic CRUD api

export function generateCRUD<Item extends WithId>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  axiosInstance.interceptors.response.use();

  const CREATE = async (object: Item) => {
    let apiRes;
    const { _id, ...objectWithoutMongoId } = object;
    try {
      const response = await axiosInstance.post<Item>(
        "/add",
        objectWithoutMongoId
      );
      apiRes = response.data;
      return apiRes;
    } catch (error) {
      apiRes = error.response.data;
      return Promise.reject(apiRes);
    }
  };

  const READ_BY_ID = async (id: string) => {
    axiosInstance.get<Item>(`/${id}`);
  };

  const READ_ALL = () => axiosInstance.get<Item[]>("");

  const UPDATE_BY_ID = async (object: Item) => {
    try {
      const res = await axiosInstance.post<Item>(
        `/update/${object._id}`,
        object
      );
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const DELETE_BY_ID = async (id: string) => {
    let apiRes = null;
    try {
      apiRes = await axiosInstance.delete(`/delete/${id}`);
      console.log("axios try", apiRes);
      return;
    } catch (error) {
      apiRes = error.response.data;
      console.log("axios error: ", error);
      return Promise.reject(apiRes);
    }
  };

  return {
    CREATE,
    READ_BY_ID,
    READ_ALL,
    UPDATE_BY_ID,
    DELETE_BY_ID,
  };
}
