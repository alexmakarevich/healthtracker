import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

// standard generic apis

export function generateAPI(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  const create = async (object: object) => {
    const res = await axiosInstance.post("/add", object);
    return console.log(res.data);
  };

  const getById = async (id: number | string) => {
    const res = await axiosInstance.get(`/${id}`);
    return await res.data;
  };

  const getAll = async () => {
    const res = await axiosInstance.get("");
    return await res.data;
  };

  const updateById = async (id: number | string, object: object) => {
    const res = await axiosInstance.post(`/update/${id}`, object);
    return res;
  };

  const deleteById = async (id: number | string) => {
    const res = await axiosInstance.delete(`/delete/${id}`);
    return res;
  };

  return { create, getById, getAll, updateById, deleteById };
}
