const timestamp = () => {
  const timestamp = new Date().toISOString();
  return timestamp;
};

export class Basic {
  _id: string = "not yet in db";
  createdOn: string = timestamp();
  lastModifiedOn: string = timestamp();
  _v: number = 0;
}
