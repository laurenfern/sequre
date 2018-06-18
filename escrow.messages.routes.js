const router = require("express").Router();
const escrowMessagesController = require("../controllers/escrow.messages.controller");
const validateBody = require("../filters/validate.body");
const message = require("../models/escrowMessage");

module.exports = router;

// api routes ===========================================================
router.get("/:escrowId([0-9a-fA-F]{24})", escrowMessagesController.readAll);
router.post("/", validateBody(message), escrowMessagesController.create);
router.delete("/:id([0-9a-fA-F]{24})", escrowMessagesController.delete);
