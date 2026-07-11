const Employee = require("../models/employee-model");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const excludeFields = [
      "__v",
      "createdAt",
      "updatedAt",
      "page",
      "limit",
      "sort",
      "fields",
    ];

    const excludeQuery = { ...req.query };
    excludeFields.forEach((field) => delete excludeQuery[field]);

    Object.keys(excludeQuery).forEach((key) => {
      if (/^(.+)\[(gte|gt|lte|lt)\]$/.test(key)) {
        delete excludeQuery[key];
      }
    });

    console.log("Query parameters:", req.query);
    console.log("Excluded query parameters:", excludeQuery);

    const range = queryRange(req.query);

    let query = Employee.find({
      ...excludeQuery,
      ...range,
    });

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field Selection
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const employees = await query;

    res.status(200).json({
      status: "success",
      count: employees.length,
      page,
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

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const employee = await Employee.create({
      ...req.body,
      imageURL: req.file ? req.file.filename : undefined,
    });

    res.status(201).json({
      status: "success",
      message: "Employee created successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    // Delete uploaded image if database operation fails
    if (req.file) {
      deleteUploadedFile("employees", req.file.filename);
    }

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

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    if (req.file) {
      if (employee.imageURL) {
        deleteUploadedFile("employees", employee.imageURL);
      }

      req.body.imageURL = req.file.filename;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Employee updated successfully",
      data: {
        employee: updatedEmployee,
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
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    if (employee.imageURL) {
      deleteUploadedFile("employees", employee.imageURL);
    }

    await Employee.findByIdAndDelete(req.params.id);

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

function queryRange(query) {
  const filtered = {};

  for (let key in query) {
    const value = query[key];
    const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

    if (match) {
      const field = match[1];
      const operator = `$${match[2]}`;

      if (!filtered[field]) {
        filtered[field] = {};
      }

      filtered[field][operator] = Number(value);
    }
  }

  return filtered;
}

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};