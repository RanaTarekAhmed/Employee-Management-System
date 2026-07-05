const express = require("express");

const {
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department-controller");

const router = express.Router();

router
  .route("/")
  .get(getAllDepartments)
  .post(createDepartment);

router
  .route("/:id")
  .get(getDepartmentById)
  .patch(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;