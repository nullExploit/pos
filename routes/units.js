var express = require("express");
const {
  getUnit,
  getAddUnit,
  getEditUnit,
  deleteUnit,
  addUnit,
  editUnit,
} = require("../controllers/unitControllers");
var router = express.Router();

router.get("/", getUnit);
router.get("/add", getAddUnit);
router.get("/edit/:id", getEditUnit);
router.get("/delete/:id", deleteUnit);

router.post("/add", addUnit);
router.post("/edit/:id", editUnit);

module.exports = router;
