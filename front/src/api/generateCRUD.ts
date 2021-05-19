import axios, { AxiosError } from "axios";
import { WithId } from "../common/types/types";

// standard generic CRUD api

export function generateCRUD<Item extends WithId>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  axiosInstance.interceptors.response.use();

  const CREATE = async (object: Item) => {
    const { _id, ...objectWithoutMongoId } = object;
    try {
      const response = await axiosInstance.post<Item>(
        "/add",
        objectWithoutMongoId
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosOrOtherError(err);
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
    } catch (err: any) {
      return handleAxiosOrOtherError(err);
    }
  };

  const DELETE_BY_ID = async (id: string) => {
    try {
      await axiosInstance.delete<string>(`/delete/${id}`);
      return;
    } catch (err: any) {
      return handleAxiosOrOtherError(err);
    }
  };

  return {
    CREATE,
    READ_BY_ID,
    READ_ALL,
    UPDATE_BY_ID,
    DELETE_BY_ID,
    axiosInstance,
  };
}

export function handleAxiosOrOtherError(error: any) {
  if (axios.isAxiosError(error as AxiosError))
    return Promise.reject(error.response.data);
  return Promise.reject(error);
}
