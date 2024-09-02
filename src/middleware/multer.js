import path from "path";
import fs from "fs";
import multer from "multer";
import { AppError } from "../utils/class.error";

export const validExtensions = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  video: ["video/webm", "video/mp4"],
  pdf: ["application/pdf"],
};

export const multerLocal = (customValidation = [], customPath = "general") => {
  const allPath = path.resolve(`uploads/${customPath}`);
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, allPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    }
    cb(new AppError("file not supported"), false);
  };
  const upload = multer({storage ,fileFilter})
  return upload;
};
