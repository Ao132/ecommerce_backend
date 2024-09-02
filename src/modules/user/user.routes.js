import { Router } from "express";
import * as UC from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { signUpValidation } from "./user.validation.js";

const router = Router();


router.post('/signup',
    validation(signUpValidation),
    UC.signUp);
router.post('/signin',UC.signIn);
router.get('/verifyEmail/:token',UC.confirmEmail);
router.get('/reSend/:refToken',UC.reSendEmail);
router.patch('/forgetPassword',UC.forgetPassword);
router.patch('/resetPassword',UC.resetPassword);

export default router;
