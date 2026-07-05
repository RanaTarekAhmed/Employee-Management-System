const Attendance = require("../models/attendance-model");

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "employee",
      "firstName lastName email department"
    );

    res.status(200).json({
      status: "success",
      count: attendance.length,
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch attendance records: ${error.message}`,
    });
  }
};

// Create attendance record
const createAttendance = async (req, res) => {
  try {
    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Attendance record created successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to create attendance record: ${error.message}`,
    });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email department"
    );

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch attendance record: ${error.message}`,
    });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    if (req.body.status) {
      req.body.status = req.body.status.toLowerCase();
    }

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Attendance updated successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to update attendance: ${error.message}`,
    });
  }
};

// Delete attendance
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Attendance deleted successfully",
      data: {
        attendance,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to delete attendance: ${error.message}`,
    });
  }
};

module.exports = {
  getAllAttendance,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};