const express = require("express");
const router = express.Router();
const { verifyEsewaPayment, getEsewaSignature } = require("../../controllers/shop/esewa-controller");
router.post("/signature", getEsewaSignature);

router.post("/verify", verifyEsewaPayment);

module.exports = router;


