var express = require("express");
const {
  getPurchase,
  getEditPurchase,
  deletePurchase,
  addPurchase,
  editPurchase,
  getPurchaseAPI,
  addPurchaseItem,
  getPurchaseItemAPI,
  deletePurchaseItem,
} = require("../controllers/purchaseControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getPurchase);
router.get("/edit/:id", hasSession, getEditPurchase);
router.get("/delete/:id", hasSession, deletePurchase);
router.get("/api", hasSession, getPurchaseAPI);
router.get("/itemsapi", hasSession, getPurchaseItemAPI)
router.get("/deleteitems/:id/:iditems", hasSession, deletePurchaseItem)

router.post("/add", hasSession, addPurchase);
router.post("/edit/:id", hasSession, editPurchase);
router.post("/additems", hasSession, addPurchaseItem)

module.exports = router;
