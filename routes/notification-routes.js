const express = require("express");

const {
  getAllNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("../controllers/notification-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllNotifications)
  .post(createNotification);

router
  .route("/:id")
  .get(getNotificationById)
  .patch(updateNotification)
  .delete(deleteNotification);

module.exports = router;