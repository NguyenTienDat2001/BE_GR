import express from "express";
import cartController from "../controllers/cartController.js";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initCartRoutes = (app) => {
  router.post("/add", permissionPage.verifyToken, cartController.addCart);
  router.get("/", permissionPage.verifyToken, cartController.getCart);
  router.post("/update", permissionPage.verifyToken, cartController.updateCart);
  router.delete("/:book_id/", permissionPage.verifyToken, cartController.deleteCart);
  

  return app.use("/api/cart", router);
};

module.exports = initCartRoutes;
