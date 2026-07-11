const Payroll = require("../models/payroll-model");

// Get all payrolls
const getAllPayrolls = async (req, res) => {
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

    let query = Payroll.find({
      ...excludeQuery,
      ...range,
    }).populate("employee", "firstName lastName email department");

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

    const payrolls = await query;

    res.status(200).json({
      status: "success",
      count: payrolls.length,
      page,
      results: payrolls.length,
      data: {
        payrolls,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch payrolls: ${error.message}`,
    });
  }
};

// Create payroll
const createPayroll = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const payroll = await Payroll.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Payroll created successfully",
      data: {
        payroll,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create payroll: ${error.message}`,
    });
  }
};

// Get payroll by ID
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!payroll) {
      return res.status(404).json({
        status: "error",
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        payroll,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch payroll: ${error.message}`,
    });
  }
};

// Update payroll
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        status: "error",
        message: "Payroll not found",
      });
    }

    const updatedPayroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee", "firstName lastName email department");

    res.status(200).json({
      status: "success",
      message: "Payroll updated successfully",
      data: {
        payroll: updatedPayroll,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update payroll: ${error.message}`,
    });
  }
};

// Delete payroll
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!payroll) {
      return res.status(404).json({
        status: "error",
        message: "Payroll not found",
      });
    }

    await Payroll.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Payroll deleted successfully",
      data: {
        payroll,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete payroll: ${error.message}`,
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
  getAllPayrolls,
  createPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};