const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../config/db");

const router = express.Router();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await sql.query`INSERT INTO tokens (user_id, refresh_token) VALUES (${userId}, ${refreshToken})`;
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.query`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`;
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result =
      await sql.query`SELECT * FROM users WHERE username = ${username}`;
    if (result.recordset.length === 0)
      return res.status(400).json({ message: "Invalid Credentials" });

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    const { accessToken, refreshToken } = generateTokens(user);
    await storeRefreshToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh Token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh Token Required" });

    const result =
      await sql.query`SELECT * FROM tokens WHERE refresh_token = ${refreshToken}`;
    if (result.recordset.length === 0)
      return res.status(403).json({ message: "Invalid Refresh Token" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, user) => {
        if (err)
          return res.status(403).json({ message: "Invalid Refresh Token" });

        const { accessToken, refreshToken: newRefreshToken } =
          generateTokens(user);
        await sql.query`UPDATE tokens SET refresh_token = ${newRefreshToken} WHERE user_id = ${user.id}`;

        res.json({ accessToken, refreshToken: newRefreshToken });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    await sql.query`DELETE FROM tokens WHERE refresh_token = ${req.body.refreshToken}`;
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
