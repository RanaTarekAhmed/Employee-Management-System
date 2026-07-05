const express = require("express");

const {
  getAllPayrolls,
  createPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payroll-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllPayrolls)
  .post(createPayroll);

router
  .route("/:id")
  .get(getPayrollById)
  .patch(updatePayroll)
  .delete(deletePayroll);

module.exports = router;