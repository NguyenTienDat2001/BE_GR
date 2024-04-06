import express from "express";
import paymentController from "../controllers/paymentController";
// import permissionPage from "../middlewares/middlewares";
// import authentication from "../middlewares/authentication";

let router = express.Router();

let initPaymentRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
  router.post("/", paymentController.processpayment);
  router.get("/infor", paymentController.getinfor);
  router.post("/trans", paymentController.createTran);
//   router.post("/", permissionPage.checkPermission(1), bookController.addBook);
//   router.post("/search", bookController.searchBook);
//   router.delete("/:id", permissionPage.checkPermission(2), bookController.deleteBook);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/payment", router);
};

module.exports = initPaymentRoutes;
