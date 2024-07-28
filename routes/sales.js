var express = require("express");
const {
  getSale,
  getEditSale,
  deleteSale,
  addSale,
  editSale,
  getSaleAPI,
  addSaleItem,
  getSaleItemAPI,
  deleteSaleItem,
} = require("../controllers/saleControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getSale);
router.get("/edit/:id", hasSession, getEditSale);
router.get("/delete/:id", hasSession, deleteSale);
router.get("/api", hasSession, getSaleAPI);
router.get("/itemsapi", hasSession, getSaleItemAPI);
router.get("/deleteitems/:id/:iditems", hasSession, deleteSaleItem);

router.post("/add", hasSession, addSale);
router.post("/edit/:id", hasSession, editSale);
router.post("/additems", hasSession, addSaleItem);

module.exports = router;
