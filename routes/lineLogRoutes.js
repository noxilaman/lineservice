const express = require("express");
const { sql } = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");
const LineLog = require("../models/LineLog");
require("dotenv").config();

const router = express.Router();

// Create Item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { group_name, msg, token, secret } = req.body;
    const newLineLog = await LineLog.create(
      {
        group_name,
        msg,
        token,
        secret,
        status: "New",
      }
    );
    res.status(201).json({ message: "line_logs added" , id: newLineLog.id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All Items
router.get("/", authenticateToken, async (req, res) => {
  try {
    const lineLogs = await LineLog.findAll();
    res.json(lineLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Single Item by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const lineLog = await LineLog.findByPk(id);
    if (!lineLog)
      return res.status(404).json({ message: "line_logs not found" });
    res.json(lineLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Item by ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { group_name, msg, token, secret } = req.body;
    const lineLog = await LineLog.findByPk(id);

    if (!lineLog) {
      return res.status(404).json({ message: "Item not found" });
    }

    lineLog.group_name = group_name;
    lineLog.msg = msg;
    lineLog.token = token;
    lineLog.secret = secret;
    lineLog.updated_at = new Date();

    await lineLog.save();

    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete Item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const lineLog = await LineLog.findByPk(id);
    if (!lineLog) {
      return res.status(404).json({ message: "line_logs not found" });
    }
    await lineLog.destroy();
    res.json({ message: "line_logs deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Single Item by ID
router.get("status/:id/:status", authenticateToken, async (req, res) => {
  try {
    const { id,status } = req.params;
    const lineLog = await LineLog.findByPk(id);

    if (!lineLog) {
      return res.status(404).json({ message: "line_logs not found" });
    }

    lineLog.status = status;
    lineLog.updated_at = new Date();

    await lineLog.save();

    res.json({ message: "line_logs status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
