import express from "express";
import { authorizeRoles, isAuth } from "../middlewares/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  createLayout
);
layoutRouter.put(
  "/edit-layout",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  editLayout
);
layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;
