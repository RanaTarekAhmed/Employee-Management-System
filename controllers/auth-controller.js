const User = require('../models/user-model');
const generateToken = require('../utils/get-jwt');
const deleteUploadedFile = require('../utils/delete-uploaded-file');
const bcrypt = require('bcryptjs');


const signup = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: 'employee',
      imageURL: req.file ? req.file.filename : 'default.jpg'
    });

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile('users', req.file.filename);
    }

    res.status(400).json({
      status: 'fail',
      message: 'Error signing up user',
      error: error.message
    });
  }
};


const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    user.password = undefined; // Remove password from the response
    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error signing in user',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  signin
};