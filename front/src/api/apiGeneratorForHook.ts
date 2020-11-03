import axios from "axios";


export interface WithId {
  _id: string
}

// standard generic apis
// TODO: ensure response typing here is consistent with actual response structures

export function generateCRUDForHook<Item extends WithId>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  axiosInstance.interceptors.response.use()

  interface CreateResponse {
    result: string;
    item: Item
  }

  const CREATE = async (object: Item) => {
    let apiRes;
    const { _id, ...objectWithoutMongoId } = object;
    try  {
       const response = await axiosInstance.post<Item>("/add", objectWithoutMongoId)
       apiRes = response.data
       return apiRes
    } catch (error) {
      apiRes = error.response.data
      return  Promise.reject(apiRes)
    }
  };

  const READ_BY_ID = async (id: string) => {
    axiosInstance.get<Item>(`/${id}`);
  };

  const READ_ALL = () => axiosInstance.get<Item[]>("");

  const UPDATE_BY_ID = async (object: Item) => {
    axiosInstance.post(`/update/${object._id}`, object);

  };

  const DELETE_BY_ID = async (id: string) => {
    let apiRes = null;
    try {
      apiRes = await axiosInstance.delete(`/delete/${id}`).then()
      console.log("axios try", apiRes);
      return
    } catch(error) {
      apiRes = error.response.data
      console.log("axios error: ", error);
      return Promise.reject(apiRes)
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
