import express from "express";
import userController from "../controllers/userController";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initUserRoutes = (app) => {
  router.get("/", userController.getUser);
  router.get("/admin", userController.getAdmin);
  router.post("/permiss", userController.updatePermiss);
  router.post("/profile", userController.updateProfile);
  router.get("/profile", permissionPage.verifyToken, userController.getInfor);
  return app.use("/api/users", router);
};

module.exports = initUserRoutes;
