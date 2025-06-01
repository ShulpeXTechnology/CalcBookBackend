const db = require("../config/db.config");
const logger = require("../utils/logger");

// CHANGE DATE
function convertToMySQLDateFormat(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

// Helper function to convert 'YYYY-MM-DD' to 'DD-MM-YYYY'
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// CREATE PURCHASE
exports.createPurchase = async (req, res) => {
  const userId = req.user.id;

  const {
    category,
    name,
    invoice,
    challn_no = req.body.challn_no,
    due_date = req.body.due_date,
    description,
    design,
    quantity,
    rate,
    total,
    debit,
    status,
    plane,
    short,
    discount,
    discount_p,
    loss,
    amount,
  } = req.body;

  const sql = `
    INSERT INTO purchase (
      user_id, category, name, invoice, challn_no, due_date, description, design,
      quantity, rate, total, debit, status, plane, short, discount,
      discount_p, loss, amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    category,
    name,
    invoice,
    challn_no,
    convertToMySQLDateFormat(due_date),
    description,
    design,
    quantity,
    rate,
    total,
    debit,
    status,
    plane,
    short,
    discount,
    discount_p,
    loss,
    amount,
  ];

  // db.query(sql, values, (err, result) => {
  //   if (err) {
  //     logger.error(`Create Purchase Error [User: ${userId}]: ${err.message}`);
  //     return res.status(500).json({ error: "Failed to insert purchase" });
  //   }
  //   logger.info(`Purchase Created [ID: ${result.insertId}, User: ${userId}]`);
  //   res.status(201).json({ message: "Purchase created", id: result.insertId });
  // });

  try {
    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Purchase created", id: result.insertId });
  } catch (err) {
    console.error("Create Purchase Error:", err.message);
    res.status(500).json({ error: "Failed to insert purchase" });
  }
};

// GET ALL PURCHASES
exports.getAllPurchases = async (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM purchase WHERE user_id = ?";

  // db.query(sql, [userId], (err, results) => {
  //   if (err) {
  //     logger.error(`Get Purchases Error [User: ${userId}]: ${err.message}`);
  //     return res.status(500).json({ error: "Failed to fetch purchases" });
  //   }
  //   logger.info(
  //     `Fetched All Purchases [User: ${userId}, Count: ${results.length}]`
  //   );
  //   res.status(200).json(results);
  // });

  try {
    const [results] = await db.query(sql, [userId]);

    // Convert due_date format
    const formattedResults = results.map((purchase) => ({
      ...purchase,
      due_date: formatDateToDDMMYYYY(purchase.due_date),
    }));

    logger.info(
      `Fetched All Purchases [User: ${userId}, Count: ${results.length}]`
    );
    res.status(200).json(formattedResults);
  } catch (err) {
    logger.error(`Get Purchases Error [User: ${userId}]: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

// GET PURCHASE BY ID
exports.getPurchaseById = async (req, res) => {
  const userId = req.user.id;
  const purchaseId = req.params.id;

  const sql = "SELECT * FROM purchase WHERE id = ? AND user_id = ?";

  // db.query(sql, [purchaseId, userId], (err, results) => {
  //   if (err) {
  //     logger.error(
  //       `Get Purchase By ID Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
  //     );
  //     return res.status(500).json({ error: "Failed to fetch purchase" });
  //   }
  //   if (results.length === 0) {
  //     logger.warn(`Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`);
  //     return res.status(404).json({ error: "Purchase not found" });
  //   }
  //   logger.info(`Purchase Retrieved [User: ${userId}, ID: ${purchaseId}]`);
  //   res.status(200).json(results[0]);
  // });

  try {
    const [results] = await db.query(sql, [purchaseId, userId]);

    if (results.length == 0) {
      logger.warn(`Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`);
      return res.status(404).json({ error: "Purchase not found" });
    }

    logger.info(`Purchase Retrieved [User: ${userId}, ID: ${purchaseId}]`);
    res.status(200).json(results[0]);
  } catch (err) {
    logger.error(
      `Get Purchase By ID Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
    );
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
};

// UPDATE PURCHASE
exports.updatePurchase = async (req, res) => {
  const userId = req.user.id;
  const purchaseId = req.params.id;
  const {
    category,
    name,
    invoice,
    challn_no,
    due_date,
    description,
    design,
    quantity,
    rate,
    total,
    debit,
    status,
    plane,
    short,
    discount,
    discount_p,
    loss,
    amount,
  } = req.body;

  const sql = `
    UPDATE purchase SET
      category = ?, name = ?, invoice = ?, challn_no = ?, due_date = ?, description = ?, design = ?,
      quantity = ?, rate = ?, total = ?, debit = ?, status = ?, plane = ?, short = ?, discount = ?,
      discount_p = ?, loss = ?, amount = ?
    WHERE id = ? AND user_id = ?
  `;

  const values = [
    category,
    name,
    invoice,
    challn_no,
    due_date,
    description,
    design,
    quantity,
    rate,
    total,
    debit,
    status,
    plane,
    short,
    discount,
    discount_p,
    loss,
    amount,
    purchaseId,
    userId,
  ];

  // db.query(sql, values, (err, result) => {
  //   if (err) {
  //     logger.error(
  //       `Update Purchase Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
  //     );
  //     return res.status(500).json({ error: "Failed to update purchase" });
  //   }
  //   if (result.affectedRows === 0) {
  //     logger.warn(
  //       `Update Failed: Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`
  //     );
  //     return res.status(404).json({ error: "Purchase not found" });
  //   }
  //   logger.info(`Purchase Updated [User: ${userId}, ID: ${purchaseId}]`);
  //   res.status(200).json({ message: "Purchase updated successfully" });
  // });

  try {
    const [result] = await db.query(sql, values);

    if (result.affectedRows == 0) {
      logger.warn(
        `Update Failed: Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`
      );
      return res.status(404).json({ error: "Purchase not found" });
    }

    logger.info(`Purchase Updated [User: ${userId}, ID: ${purchaseId}]`);
    res.status(200).json({ message: "Purchase updated successfully" });
  } catch (err) {
    logger.error(
      `Update Purchase Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
    );
    res.status(500).json({ error: "Failed to update purchase" });
  }
};

// DELETE PURCHASE
exports.deletePurchase = async (req, res) => {
  const userId = req.user.id;
  const purchaseId = req.params.id;

  const sql = "DELETE FROM purchase WHERE id = ? AND user_id = ?";

  // db.query(sql, [purchaseId, userId], (err, result) => {
  //   if (err) {
  //     logger.error(
  //       `Delete Purchase Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
  //     );
  //     return res.status(500).json({ error: "Failed to delete purchase" });
  //   }
  //   if (result.affectedRows == 0) {
  //     logger.warn(
  //       `Delete Failed: Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`
  //     );
  //     return res.status(404).json({ error: "Purchase not found" });
  //   }
  //   logger.info(`Purchase Deleted [User: ${userId}, ID: ${purchaseId}]`);
  //   res.status(200).json({ message: "Purchase deleted successfully" });
  // });

  try {
    const [result] = await db.query(sql, [purchaseId, userId]);

    if (result.affectedRows == 0) {
      logger.warn(
        `Delete Failed: Purchase Not Found [User: ${userId}, ID: ${purchaseId}]`
      );
      return res.status(404).json({ error: "Purchase not found" });
    }

    logger.info(`Purchase Deleted [User: ${userId}, ID: ${purchaseId}]`);
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (err) {
    logger.error(
      `Delete Purchase Error [User: ${userId}, ID: ${purchaseId}]: ${err.message}`
    );
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};
