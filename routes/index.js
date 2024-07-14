var express = require("express");
var router = express.Router();

const {
  getIndex,
  getRegister,
  postIndex,
  postRegister,
} = require("../controllers/userControllers");
const { getDashboard, getUser, getLogout } = require("../controllers/pageControllers");
const hasSession = require("../helper/util");

/* GET home page. */
router.get("/", getIndex);
router.get("/register", getRegister);
router.get("/dashboard", hasSession, getDashboard);
router.get("/users", hasSession, getUser);
router.get("/logout", hasSession, getLogout)

router.post("/", postIndex);
router.post("/register", postRegister);

module.exports = router;
