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
const checkRole = require("../helper/checkrole");

router.get("/", hasSession, checkRole, getUnit);
router.get("/add", hasSession, checkRole, getAddUnit);
router.get("/edit/:id", hasSession, checkRole, getEditUnit);
router.get("/delete/:id", hasSession, checkRole, deleteUnit);
router.get("/api", hasSession, checkRole, getUnitAPI);

router.post("/add", hasSession, checkRole, addUnit);
router.post("/edit/:id", hasSession, checkRole, editUnit);

module.exports = router;
