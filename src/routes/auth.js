import express from "express";
import authController from "../controllers/authController";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initAuthRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.post("/register", authController.handleCreateNewUser);
  router.post("/login", authController.handleLogin);
  router.get("/verify", authController.verifyUser);
  router.get("/logout", authController.logout);
  router.post("/change", authController.changePassword);
  router.get("/test", authController.test);

  return app.use("/api", router);
};

module.exports = initAuthRoutes;
