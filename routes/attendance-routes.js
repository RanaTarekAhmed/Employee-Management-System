const express = require("express");

const {
  getAllAttendance,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendance-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllAttendance)
  .post(createAttendance);

router
  .route("/:id")
  .get(getAttendanceById)
  .patch(updateAttendance)
  .delete(deleteAttendance);

module.exports = router;