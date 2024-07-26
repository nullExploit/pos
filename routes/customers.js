var express = require("express");
const {
  getCustomer,
  getAddCustomer,
  getEditCustomer,
  deleteCustomer,
  addCustomer,
  editCustomer,
  getCustomerAPI,
} = require("../controllers/customerControllers");
var router = express.Router();

const hasSession = require("../helper/util");

router.get("/", hasSession, getCustomer);
router.get("/add", hasSession, getAddCustomer);
router.get("/edit/:id", hasSession, getEditCustomer);
router.get("/delete/:id", hasSession, deleteCustomer);
router.get("/api", hasSession, getCustomerAPI);

router.post("/add", hasSession, addCustomer);
router.post("/edit/:id", hasSession, editCustomer);

module.exports = router;
