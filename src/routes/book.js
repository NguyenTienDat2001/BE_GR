import express from "express";
import bookController from "../controllers/bookController";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initBookRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.get("/", permissionPage.verifyToken, bookController.getAllbook);
  router.get("/:id", permissionPage.verifyToken, bookController.getBook);
  router.get("/borrow/list", permissionPage.verifyToken, bookController.getBorrowBook);
  router.post("/", permissionPage.checkPermission(1), bookController.addBook);
  router.post("/chapter", bookController.addChapter);
  router.get("/chapter/:id", bookController.getChapter);
  router.post("/search", bookController.searchBook);
  router.get("/bookmark/all", permissionPage.verifyToken, bookController.getBookmark);
  router.post("/bookmark", permissionPage.verifyToken, bookController.addBookmark);
  router.delete("/:id", permissionPage.checkPermission(2), bookController.deleteBook);
  router.delete("/bookmark/:id", permissionPage.verifyToken, bookController.deleteBookmark);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/books", router);
};

module.exports = initBookRoutes;
