import express from "express";
import cartController from "../controllers/cartController.js";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initCartRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
//   router.get("/", bookController.getAllbook);
//   router.get("/:id", bookController.getBook);
  router.post("/add", cartController.addCart);
  router.get("/", permissionPage.verifyToken, cartController.getCart);
  router.put("/:book_id/:scope", cartController.updateCart);
  router.delete("/:book_id/", cartController.deleteCart);
//   router.post("/search", bookController.searchBook);
//   router.delete("/:id", bookController.deleteBook);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/cart", router);
};

module.exports = initCartRoutes;
