const pool = require("../config/db.config");

// Create user
exports.createUser = async ({ name, mobileNo, password }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, mobileNo, password) VALUES (?, ?, ?)",
    [name, mobileNo, password]
  );
  return { id: result.insertId, name, mobileNo };
};

// Find user by mobileNo
exports.findUserByMobileNo = async (mobileNo) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE mobileNo = ?", [
    mobileNo,
  ]);
  return rows[0];
};

// Find user by ID
exports.findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, mobileNo FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Update Password
exports.updateUserPassword = async (mobileNo, hashedPassword) => {
  const [result] = await pool.query(
    "UPDATE users SET password = ? WHERE mobileNo = ?",
    [hashedPassword, mobileNo]
  );
  return result;
};
