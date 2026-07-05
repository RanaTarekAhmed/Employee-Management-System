const Department = require("../models/department-model");

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json({
      status: "success",
      count: departments.length,
      data: {
        departments,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch departments: ${error.message}`,
    });
  }
};

// Create department
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Department created successfully",
      data: {
        department,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create department: ${error.message}`,
    });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "error",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        department,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch department: ${error.message}`,
    });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        status: "error",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Department updated successfully",
      data: {
        department,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update department: ${error.message}`,
    });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "error",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Department deleted successfully",
      data: {
        department,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete department: ${error.message}`,
    });
  }
};

module.exports = {
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};