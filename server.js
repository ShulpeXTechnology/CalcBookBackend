const express = require("express");
const app = express();
const cors = require("cors");
const purchaseRoutes = require("./routes/invoice.routes");
const categoryRoutes = require("./routes/category.routes");

require("dotenv").config();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", purchaseRoutes);

// Categories
app.use("/api", categoryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
