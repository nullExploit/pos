var express = require("express");
const {
  getUnit,
  getAddUnit,
  getEditUnit,
  deleteUnit,
  addUnit,
  editUnit,
  getUnitAPI,
} = require("../controllers/unitControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getUnit);
router.get("/add", hasSession, getAddUnit);
router.get("/edit/:id", hasSession, getEditUnit);
router.get("/delete/:id", hasSession, deleteUnit);
router.get("/api", hasSession, getUnitAPI);

router.post("/add", hasSession, addUnit);
router.post("/edit/:id", hasSession, editUnit);

module.exports = router;
