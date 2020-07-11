import axios, { AxiosInstance } from "axios";

const nutritionItemsInstance = axios.create({
  baseURL: "http://localhost:4000/nutritionItems",
});

// standard generic apis

export function generateAPI(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  const create = (object: object) => {
    return axiosInstance
      .post("/add", object)
      .then((res) => console.log(res.data));
  };

  const getById = (id: number | string) => {
    return axiosInstance.get(`/${id}`).then((res) => console.log(res.data));
  };

  const getAll = () => {
    return axiosInstance.get("").then((res) => console.log(res.data));
  };

  const updateById = (id: number | string, object: object) => {
    return axiosInstance
      .put(`/${id}`, object)
      .then((res) => console.log(res.data));
  };

  const deleteById = (id: number | string) => {
    return axiosInstance.delete(`/${id}`).then((res) => console.log(res.data));
  };

  return { create, getById, getAll, updateById, deleteById };
}
