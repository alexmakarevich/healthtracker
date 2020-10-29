import axios from "axios";


export interface WithId {
  _id: string
}

// standard generic apis
// TODO: ensure response typing here is consistent with actual response structures

export function generateCRUD <Item extends WithId>(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  interface CreateResponse {
    result: string;
    item: Item
  }

  const CREATE = async (object: Item) => {
    const { _id, ...objectWithoutMongoId } = object;
    const res = await axiosInstance.post("/add", objectWithoutMongoId);
    // console.log("CREATE result");
    // console.log(res.data);
    return res.data.item as CreateResponse["item"];
  };

  const READ_BY_ID = async (id: string) => {
    const res = await axiosInstance.get(`/${id}`);
    // console.log(res.data);
    return await res.data as Item;
  };

  const READ_ALL = async () => {
    const res = await axiosInstance.get("");
    // console.log(res.data);
    return await res.data as Item[];
  };

  const UPDATE_BY_ID = async (object: Item) => {
    const res = await axiosInstance.post(`/update/${object._id}`, object);
    // console.log(res.data);
    return await res.data as Item;
  };

  const DELETE_BY_ID = async (id: string) => {
    const res = await axiosInstance.delete(`/delete/${id}`);
    console.log(res.data);
    return res.data as string;
  };

  return {
    CREATE,
    READ_BY_ID,
    READ_ALL,
    UPDATE_BY_ID,
    DELETE_BY_ID,
  };
}
