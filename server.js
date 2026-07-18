require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});