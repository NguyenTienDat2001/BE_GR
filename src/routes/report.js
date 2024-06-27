import express from "express";
import reportController from "../controllers/reportController";
import permissionPage from "../middlewares/middlewares";
let router = express.Router();

let initReportRoutes = (app) => {
//   router.post("/", eventController.addEvent);
//   router.get("/", eventController.getEvent);
  router.get("/revenue", reportController.getLine);//doanh thu
  router.post("/order", reportController.getColumn);//don hang
  router.get("/age", reportController.getAge);//tuoi
  router.get("/number", reportController.getNumber);//thong ke so luong
//   router.put("/:id", eventController.updateEvent);
//   router.delete("/:id", eventController.deleteEvent);
  return app.use("/api/reports", router);
};

module.exports = initReportRoutes;