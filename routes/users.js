var express = require("express");
var router = express.Router();

const hasSession = require("../helper/util");
const { getUser, getAddUser, getEditUser, addUser, editUser, deleteUser } = require("../controllers/userControllers");

router.get("/", hasSession, getUser);
router.get("/add", getAddUser)
router.get("/edit/:id", getEditUser)
router.get("/delete/:id", deleteUser)

router.post("/add", addUser)
router.post("/edit/:id", editUser)

module.exports = router;