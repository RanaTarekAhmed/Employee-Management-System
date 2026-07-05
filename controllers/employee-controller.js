const Employee = require("../models/employee-model");

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).json({
      status: "success",
      count: employees.length,
      data: {
        employees,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch employees: ${error.message}`,
    });
  }
};

// Create employee
const createEmployee = async (req, res) => {
  try {
    if (req.body.department) {
      req.body.department = req.body.department.toLowerCase();
    }

    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const employee = await Employee.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Employee created successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create employee: ${error.message}`,
    });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        employee,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch employee: ${error.message}`,
    });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    if (req.body.department) {
      req.body.department = req.body.department.toLowerCase();
    }

    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Employee updated successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update employee: ${error.message}`,
    });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Employee deleted successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};