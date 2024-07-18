var express = require("express");
const {
  getSupplier,
  getAddSupplier,
  getEditSupplier,
  deleteSupplier,
  addSupplier,
  editSupplier,
} = require("../controllers/supplierControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getSupplier);
router.get("/add", hasSession, getAddSupplier);
router.get("/edit/:id", hasSession, getEditSupplier);
router.get("/delete/:id", hasSession, deleteSupplier);

router.post("/add", hasSession, addSupplier);
router.post("/edit/:id", hasSession, editSupplier);

module.exports = router;
