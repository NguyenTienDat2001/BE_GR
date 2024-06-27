import express from "express";
import imexportController from "../controllers/imexportController";
import permissionPage from "../middlewares/middlewares";
let router = express.Router();

let initImexportRoutes = (app) => {
  router.post("/", imexportController.addImexport);
  router.get("/import", imexportController.import);
  router.get("/export", imexportController.export);
  router.get("/detail/:id", imexportController.getDetail);
  router.post("/update", imexportController.updateStatus);
  return app.use("/api/imexports", router);
};

module.exports = initImexportRoutes;