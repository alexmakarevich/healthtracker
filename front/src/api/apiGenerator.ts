import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

// standard generic apis

export function generateCRUD(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  const create = async (object: object) => {
    const res = await axiosInstance.post("/add", object);
    return console.log(res.data);
  };

  const readById = async (id: number | string) => {
    const res = await axiosInstance.get(`/${id}`);
    return await res.data;
  };

  const readAll = async () => {
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

  return {
    create,
    readById,
    readAll,
    updateById,
    deleteById,
  };
}
