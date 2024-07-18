var express = require("express");
const {
  getGood,
  getAddGood,
  getEditGood,
  deleteGood,
  addGood,
  editGood,
} = require("../controllers/goodControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getGood);
router.get("/add", hasSession, getAddGood);
router.get("/edit/:id", hasSession, getEditGood);
router.get("/delete/:id", hasSession, deleteGood);

router.post("/add", hasSession, addGood);
router.post("/edit/:id", hasSession, editGood);

module.exports = router;
