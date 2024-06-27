import express from "express";
import eventController from "../controllers/eventController";
import permissionPage from "../middlewares/middlewares";
let router = express.Router();

let initEventRoutes = (app) => {
  router.post("/", eventController.addEvent);
  router.get("/", eventController.getEvent);
  router.get("/active", eventController.getEventActive);
  router.put("/:id", eventController.updateEvent);
  router.delete("/:id", eventController.deleteEvent);
  return app.use("/api/events", router);
};

module.exports = initEventRoutes;