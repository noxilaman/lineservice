const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

app.use("/auth", authRoutes);
app.use("/line_logs", require("./routes/lineLogRoutes"));

const PORT = process.env.PORT || 5000;

// 🔹 Start Server & Connect to DB
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
