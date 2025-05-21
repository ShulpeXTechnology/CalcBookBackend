const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/invoice.controller");
const authMiddleware = require("../middleware/auth.middleware");

// POST /purchase
router.post("/purchase", authMiddleware, purchaseController.createPurchase);

// Get all purchases
router.get("/purchase", authMiddleware, purchaseController.getAllPurchases);

// Get a single purchase by ID
router.get("/purchase/:id", authMiddleware, purchaseController.getPurchaseById);

// Update a purchase by ID
router.put("/purchase/:id", authMiddleware, purchaseController.updatePurchase);

// Delete a purchase by ID
router.delete(
  "/purchase/:id",
  authMiddleware,
  purchaseController.deletePurchase
);

module.exports = router;
