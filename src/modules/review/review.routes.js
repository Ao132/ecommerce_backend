import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { deleteReviewwVal, reviewVal } from "./review.validation.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";

import * as RC from "./review.controller.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.post(
  "/createReview",
  validation(reviewVal),
  auth(Object.values(systemRoles)),
  RC.createReview
);
reviewRouter.delete(
  "/deleteReview/:id",
  validation(deleteReviewwVal),
  auth(Object.values(systemRoles)),
  RC.deleteReview
);

export default reviewRouter;
