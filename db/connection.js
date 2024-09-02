import {mongoose} from "mongoose";

 const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL_ONLINE)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => console.log({ msg: "Error connecting", err: err }));
};
export default connectionDB;