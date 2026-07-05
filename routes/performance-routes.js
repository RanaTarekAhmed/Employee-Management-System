const express = require("express");

const {
  getAllPerformances,
  createPerformance,
  getPerformanceById,
  updatePerformance,
  deletePerformance,
} = require("../controllers/performance-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllPerformances)
  .post(createPerformance);

router
  .route("/:id")
  .get(getPerformanceById)
  .patch(updatePerformance)
  .delete(deletePerformance);

module.exports = router;