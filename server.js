require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/line_logs", require("./routes/lineLogRoutes"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
