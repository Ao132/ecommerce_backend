import multer from "multer";
import { AppError } from "../utils/class.error.js";
import path from "path";
import fs from "fs";

export const validExtensions = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  video: ["video/mp4", "video/quicktime", "video/webm", "video/mkv"],
  pdf: ["application/pdf"],
};
export const multerHost = (customValidation) => {
  // const allPath=path.resolve(`uploads/${customPath}`)
  // if (!fs.existsSync(allPath)) {
  //   fs.mkdirSync(allPath, { recursive: true });
  // }
  const storage = multer.diskStorage({});
  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("file not supported", 101), false);
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};
