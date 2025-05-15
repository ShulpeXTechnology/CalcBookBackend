const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/invoice.controller");

// POST /purchase
router.post("/purchase", purchaseController.createPurchase);

// Get all purchases
router.get("/purchase", purchaseController.getAllPurchases);

// Get a single purchase by ID
router.get("/purchase/:id", purchaseController.getPurchaseById);

// Update a purchase by ID
router.put("/purchase/:id", purchaseController.updatePurchase);

// Delete a purchase by ID
router.delete("/purchase/:id", purchaseController.deletePurchase);

module.exports = router;
