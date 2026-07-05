const Payroll = require("../models/payroll-model");

// Get all payrolls
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      "employee",
      "firstName lastName email department"
    );

    res.status(200).json({
      status: "success",
      count: payrolls.length,
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
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!payroll) {
      return res.status(404).json({
        status: "error",
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Payroll updated successfully",
      data: {
        payroll,
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
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        status: "error",
        message: "Payroll not found",
      });
    }

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

module.exports = {
  getAllPayrolls,
  createPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};