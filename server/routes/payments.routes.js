const router = require("express").Router();
const paymentsController = require("../controllers/payments.controller");

module.exports = router;

// api routes ===========================================================
router.get("/invoice/:stripeId", paymentsController.getAllInvoices);
router.put("/createCustomer", paymentsController.createCustomer);
