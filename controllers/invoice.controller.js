const db = require("../config/db.config");

exports.createPurchase = (req, res) => {
  const {
    id,
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
    INSERT INTO purchase (
      id, category, name, invoice, challn_no, due_date, description, design,
      quantity, rate, total, debit, status, plane, short, discount,
      discount_p, loss, amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id,
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
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to insert purchase record" });
    }

    res.status(201).json({
      message: "Purchase inserted successfully",
      insertId: result.insertId,
    });
  });
};

exports.getAllPurchases = (req, res) => {
  const sql = "SELECT * FROM purchase";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch purchase records" });
    }

    res.status(200).json(results);
  });
};

exports.getPurchaseById = (req, res) => {
  const purchaseId = req.params.id;

  const sql = "SELECT * FROM purchase WHERE id = ?";

  db.query(sql, [purchaseId], (err, result) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch purchase" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(200).json(result[0]);
  });
};

exports.updatePurchase = (req, res) => {
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
    WHERE id = ?
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
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Update Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update purchase record" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(200).json({ message: "Purchase updated successfully" });
  });
};

exports.deletePurchase = (req, res) => {
  const purchaseId = req.params.id;

  const sql = "DELETE FROM purchase WHERE id = ?";

  db.query(sql, [purchaseId], (err, result) => {
    if (err) {
      console.error("Database Delete Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete purchase record" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(200).json({ message: "Purchase deleted successfully" });
  });
};
