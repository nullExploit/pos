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
  getUserAPI,
  getProfile,
  getPassword,
  changeProfile,
  changePassword,
} = require("../controllers/userControllers");

router.get("/", hasSession, getUser);
router.get("/add", hasSession, getAddUser);
router.get("/edit/:id", hasSession, getEditUser);
router.get("/delete/:id", hasSession, deleteUser);
router.get("/api", hasSession, getUserAPI);
router.get("/profile", hasSession, getProfile);
router.get("/changepassword", hasSession, getPassword);

router.post("/add", hasSession, addUser);
router.post("/edit/:id", hasSession, editUser);
router.post("/profile", hasSession, changeProfile)
router.post("/changepassword", hasSession, changePassword)

module.exports = router;
