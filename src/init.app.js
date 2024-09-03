import { AppError } from "../src/utils/class.error.js";
import { globalErrorHandler } from "./middleware/async.handler.js";

import connectionD from "../db/connection.js";
import * as routers from "../src/modules/index.routes.js";
import { deleteFromCloudinary } from "./middleware/delete.clo.files.n.stored.js";
import { deleteFromDB } from "./middleware/delete.from.db.js";

import cors from "cors";

export const initApp = (app, express) => {
  app.use(cors());
  app.use((req, res, next) => {
    if (req.originalUrl == "/orders/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.get("/", (req, res) => {
    res.json("Welcome to E-commerce API");
  });

  app.use("/users", routers.userRouter);

  app.use("/categories", routers.categoryRouter);

  app.use("/subCategories", routers.subCategoryRouter);

  app.use("/brands", routers.brandRouter);

  app.use("/products", routers.productRouter);

  app.use("/coupons", routers.couponRouter);

  app.use("/carts", routers.cartRouter);

  app.use("/orders", routers.orderRouter);

  app.use("/review", routers.reviewRouter);

  app.use("/wishlist", routers.wishlistRouter);

  app.use("*", (req, res, next) => {
    next(new AppError("404 not found", 404));
  });
  app.use(globalErrorHandler, deleteFromCloudinary, deleteFromDB);
};

connectionD();
