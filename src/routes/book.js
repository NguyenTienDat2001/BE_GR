import express from "express";
import bookController from "../controllers/bookController";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initBookRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.get("/", bookController.getAllbook);
  router.get("/:id", bookController.getBook);
  router.post("/", permissionPage.checkPermission(1), bookController.addBook);
  router.post("/search", bookController.searchBook);
  router.delete("/:id", permissionPage.checkPermission(2), bookController.deleteBook);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/books", router);
};

module.exports = initBookRoutes;
