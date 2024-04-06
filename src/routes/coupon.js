import express from "express";
import couponController from "../controllers/couponController";
import permissionPage from "../middlewares/middlewares";

// import authentication from "../middlewares/authentication";

let router = express.Router();

let initCouponRoutes = (app) => {
  //   router.post("/login", authController.handleLogin);
//   router.get("/", bookController.getAllbook);
//   router.get("/:id", bookController.getBook);
  router.post("/", permissionPage.checkPermission(3), couponController.addCoupon);
  router.get("/", couponController.getAllCoupons);
  router.delete("/:coupon_id", permissionPage.checkPermission(4), couponController.deleteCoupon);
//   router.post("/search", bookController.searchBook);
//   router.delete("/:id", bookController.deleteBook);
  // router.get("/:id", bookController.getBook);
  // router.get("/:id", bookController.getBook);
  // router.post("/login", authController.handleLogin);
  // router.get("/verify", authController.verifyUser);
  // router.get("/logout", authController.logout);
  

  return app.use("/api/coupons", router);
};

module.exports = initCouponRoutes;
