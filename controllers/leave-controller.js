const Leave = require("../models/leave-model");

// Get all leave requests
const getAllLeaves = async (req, res) => {
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

    let query = Leave.find({
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

    const leaves = await query;

    res.status(200).json({
      status: "success",
      count: leaves.length,
      page,
      results: leaves.length,
      data: {
        leaves,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch leave requests: ${error.message}`,
    });
  }
};

// Create leave request
const createLeave = async (req, res) => {
  try {
    if (req.body.leaveType) {
      req.body.leaveType = req.body.leaveType.toLowerCase();
    }

    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    console.log("Request body:", req.body);

    const leave = await Leave.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Leave request created successfully",
      data: {
        leave,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create leave request: ${error.message}`,
    });
  }
};

// Get leave by ID
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!leave) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        leave,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch leave request: ${error.message}`,
    });
  }
};

// Update leave request
const updateLeave = async (req, res) => {
  try {
    if (req.body.leaveType) {
      req.body.leaveType = req.body.leaveType.toLowerCase();
    }

    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee", "firstName lastName email department");

    res.status(200).json({
      status: "success",
      message: "Leave request updated successfully",
      data: {
        leave: updatedLeave,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update leave request: ${error.message}`,
    });
  }
};

// Delete leave request
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!leave) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Leave request deleted successfully",
      data: {
        leave,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete leave request: ${error.message}`,
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
  getAllLeaves,
  createLeave,
  getLeaveById,
  updateLeave,
  deleteLeave,
};