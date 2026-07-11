const Department = require("../models/department-model");

// Get all departments
const getAllDepartments = async (req, res) => {
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

    let query = Department.find({
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

    const departments = await query;

    res.status(200).json({
      status: "success",
      count: departments.length,
      page,
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
    if (req.body.name) {
      req.body.name = req.body.name.toLowerCase();
    }

    console.log("Request body:", req.body);

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
    if (req.body.name) {
      req.body.name = req.body.name.toLowerCase();
    }

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "error",
        message: "Department not found",
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Department updated successfully",
      data: {
        department: updatedDepartment,
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
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "error",
        message: "Department not found",
      });
    }

    await Department.findByIdAndDelete(req.params.id);

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

// Range Query Helper
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
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};