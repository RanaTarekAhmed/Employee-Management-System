const express = require("express");

const {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(createEmployee);

router
  .route("/:id")
  .get(getEmployeeById)
  .patch(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;