// routes/auth.js
const db = require("../models/index");

const bcrypt = require("bcryptjs");
const User = db.userModel;
const jwtUtils = require("../helper/jwt");

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw new Error("Please Provide a email address!");
    }

    if (!password) {
      throw new Error("Please Provide a password!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw new Error("Please Provide a email/username address!");
    }

    if (!password) {
      throw new Error("Please Provide a password!");
    }

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwtUtils.generateToken({
      id: user.id,
      username: user.username,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
  }
};
