const Leave = require("../models/leave-model");

// Get all leave requests
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      "employee",
      "firstName lastName email department"
    );

    res.status(200).json({
      status: "success",
      count: leaves.length,
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

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Leave request updated successfully",
      data: {
        leave,
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
    const leave = await Leave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

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

module.exports = {
  getAllLeaves,
  createLeave,
  getLeaveById,
  updateLeave,
  deleteLeave,
};