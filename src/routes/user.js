import express from "express";
import userController from "../controllers/userController";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initUserRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.get("/", userController.getUser);
  router.get("/admin", userController.getAdmin);
  router.post("/permiss", userController.updatePermiss);
  router.get("/profile", permissionPage.verifyToken, userController.getInfor);
//   router.post("/", permissionPage.checkPermission(1), bookController.addBook);
//   router.post("/search", bookController.searchBook);
//   router.delete("/:id", permissionPage.checkPermission(2), bookController.deleteBook);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/users", router);
};

module.exports = initUserRoutes;
