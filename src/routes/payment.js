import express from "express";
import paymentController from "../controllers/paymentController";
import permissionPage from "../middlewares/middlewares";

let router = express.Router();

let initPaymentRoutes = (app) => {
  router.post("/", paymentController.processpayment);
  router.get("/infor", paymentController.getinfor);
  router.post("/trans", paymentController.createTran);
  

  return app.use("/api/payment", router);
};

module.exports = initPaymentRoutes;
