var express = require("express");
var router = express.Router();

const { getIndex, postIndex } = require("../controllers/userControllers");
const { getDashboard, getLogout } = require("../controllers/pageControllers");
const hasSession = require("../helper/util");

/* GET home page. */
router.get("/", getIndex);
router.get("/dashboard", hasSession, getDashboard);
router.get("/logout", hasSession, getLogout);

router.post("/", postIndex);

module.exports = router;
