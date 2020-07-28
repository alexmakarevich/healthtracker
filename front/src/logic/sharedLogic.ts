const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export interface Basic {
  _id: string;
  createdOn: string;
  lastModifiedOn: string ;
  _v?: number ;
}
