import express from "express";
import couponController from "../controllers/couponController";
import permissionPage from "../middlewares/middlewares";
let router = express.Router();

let initCouponRoutes = (app) => {
  router.post("/", permissionPage.checkPermission(3), couponController.addCoupon);
  router.get("/", couponController.getAllCoupons);
  router.get("/gift", couponController.getGift);
  router.post("/exchange", permissionPage.verifyToken, couponController.exchangeCoupon);
  router.get("/mycoupon", permissionPage.verifyToken, couponController.getMycoupon);
  router.post("/apply", couponController.applyCoupon);
  router.delete("/:coupon_id", permissionPage.checkPermission(4), couponController.deleteCoupon);
  return app.use("/api/coupons", router);
};

module.exports = initCouponRoutes;
