const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// 🔹 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password required" });

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered", userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No token provided" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
