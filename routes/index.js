var express = require("express");
var router = express.Router();

const { getIndex, postIndex } = require("../controllers/userControllers");
const hasSession = require("../helper/util");

/* GET home page. */
router.get("/", getIndex);

router.get("/dashboard", hasSession, (req, res) => {
  res.render("dashboard", { username: req.session.user.name });
});

router.get("/logout", hasSession, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/", postIndex);

module.exports = router;
