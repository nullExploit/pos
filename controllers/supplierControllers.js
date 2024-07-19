const Supplier = require("../models/Supplier");

function getSupplier(req, res) {
  Supplier.all().then((datas) => {
    res.render("suppliers/view", { datas, username: req.session.user.name });
  });
}

function getAddSupplier(req, res) {
  res.render("suppliers/form", { data: {}, username: req.session.user.name });
}

function getEditSupplier(req, res) {
  const id = req.params.id;
  Supplier.get(id).then((data) => {
    res.render("suppliers/form", { data, username: req.session.user.name });
  });
}

function addSupplier(req, res) {
  const { name, address, phone } = req.body;

  Supplier.create(name, address, phone).then(() => {
    res.redirect("/suppliers");
  });
}

function editSupplier(req, res) {
  const id = req.params.id;
  const { name, address, phone } = req.body;

  Supplier.update(name, address, phone, id).then(() => {
    res.redirect("/suppliers");
  });
}

function deleteSupplier(req, res) {
  const id = req.params.id;
  Supplier.del(id).then(res.redirect("/suppliers"));
}

module.exports = {
  getSupplier,
  getAddSupplier,
  getEditSupplier,
  addSupplier,
  editSupplier,
  deleteSupplier,
};
