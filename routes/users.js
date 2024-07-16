var express = require("express");
var router = express.Router();

const hasSession = require("../helper/util");
const {
  getUser,
  getAddUser,
  getEditUser,
  addUser,
  editUser,
  deleteUser,
} = require("../controllers/userControllers");

router.get("/", hasSession, getUser);
router.get("/add", hasSession, getAddUser);
router.get("/edit/:id", hasSession, getEditUser);
router.get("/delete/:id", hasSession, deleteUser);

router.post("/add", hasSession, addUser);
router.post("/edit/:id", hasSession, editUser);

module.exports = router;
