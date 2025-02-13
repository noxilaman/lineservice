const express = require("express");
const { sql } = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { group_name,msg,token,secret } = req.body;
    await sql.query`INSERT INTO line_logs (group_name, msg, token, secret, status, created_at, updated_at) VALUES (${group_name}, ${msg}, ${token}, ${secret}, 'New',getdate(), getdate())`;
    res.status(201).json({ message: "line_logs added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All Items
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM line_logs`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Single Item by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM line_logs WHERE id = ${id}`;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: "line_logs not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Item by ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { group_name, msg, token, secret } = req.body;
    const result =
      await sql.query`UPDATE line_logs SET group_name=${group_name},msg=${msg},token=${token},secret=${secret},updated_at=getdate() WHERE id = ${id}`;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete Item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await sql.query`DELETE FROM line_logs WHERE id = ${id}`;
    res.json({ message: "line_logs deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Single Item by ID
router.get("status/:id/:status", authenticateToken, async (req, res) => {
  try {
    const { id,status } = req.params;
    const result =
      await sql.query`UPDATE line_logs SET status=${status},updated_at=getdate() WHERE id = ${id}`;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "line_logs not found" });

    res.json({ message: "line_logs status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
