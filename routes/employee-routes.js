const express = require("express");

const {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee-controller");

const multerUpload = require("../middlewares/multer-middleware");

const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(multerUpload.single("imageURL"), createEmployee);

router
  .route("/:id")
  .get(getEmployeeById)
  .patch(multerUpload.single("imageURL"), updateEmployee)
  .delete(deleteEmployee);

module.exports = router;