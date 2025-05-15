const db = require("../config/db.config");

const getCategories = (req, res) => {
  const query = "SELECT DISTINCT category FROM your_table_name";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const categories = results.map((row) => row.category);
    res.json(categories);
  });
};

module.exports = {
  getCategories,
};
