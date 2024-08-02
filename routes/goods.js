var express = require("express");
const {
  getGood,
  getAddGood,
  getEditGood,
  deleteGood,
  addGood,
  editGood,
  getGoodAPI,
  getGoodPurchaseAPI,
  goodAlert,
} = require("../controllers/goodControllers");
var router = express.Router();

const hasSession = require("../helper/util");
const checkRole = require("../helper/checkrole");

router.get("/", hasSession, checkRole, getGood);
router.get("/add", hasSession, checkRole, getAddGood);
router.get("/edit/:id", hasSession, checkRole, getEditGood);
router.get("/delete/:id", hasSession, checkRole, deleteGood);
router.get("/api", hasSession, checkRole, getGoodAPI);
router.get("/itemsapi", hasSession, getGoodPurchaseAPI);
router.get("/alertapi", hasSession, checkRole, goodAlert)

router.post("/add", hasSession, checkRole, addGood);
router.post("/edit/:id", hasSession, checkRole, editGood);

module.exports = router;
