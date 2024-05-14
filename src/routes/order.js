import express from "express";
import orderController from "../controllers/orderController";
import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();
let initOrderRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.get("/", permissionPage.verifyToken, orderController.getOrder);
  router.get("/:id", orderController.getOrderDetail);
  return app.use("/api/orders", router);
};

module.exports = initOrderRoutes;
