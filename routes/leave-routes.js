const express = require("express");

const {
  getAllLeaves,
  createLeave,
  getLeaveById,
  updateLeave,
  deleteLeave,
} = require("../controllers/leave-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllLeaves)
  .post(createLeave);

router
  .route("/:id")
  .get(getLeaveById)
  .patch(updateLeave)
  .delete(deleteLeave);

module.exports = router;