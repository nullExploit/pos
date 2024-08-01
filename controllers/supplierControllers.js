const Supplier = require("../models/Supplier");

function getSupplier(req, res) {
  res.render("suppliers/view", {
    username: req.session.user.name,
    role: req.session.user.role,
  });
}

async function getSupplierAPI(req, res) {
  const { draw, length, start, search, columns, order } = req.query;
  const result = await Supplier.all(
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    draw,
    length,
    start,
    columns ? columns[req.query.order[0].column].data : "supplierid",
    order ? order[0].dir : "desc"
  );
  res.json(result);
}

function getAddSupplier(req, res) {
  res.render("suppliers/form", {
    data: {},
    username: req.session.user.name,
    role: req.session.user.role,
  });
}

function getEditSupplier(req, res) {
  const id = req.params.id;
  Supplier.get(id).then((data) => {
    res.render("suppliers/form", {
      data,
      username: req.session.user.name,
      role: req.session.user.role,
    });
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
  getSupplierAPI,
};
