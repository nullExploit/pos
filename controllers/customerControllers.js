const Customer = require("../models/Customer");

function getCustomer(req, res) {
  res.render("customers/view", { username: req.session.user.name });
}

async function getCustomerAPI(req, res) {
  const { draw, length, start, search, columns, order } = req.query;
  const result = await Customer.all(
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    draw,
    length,
    start,
    columns ? columns[req.query.order[0].column].data : "customerid",
    order ? order[0].dir : "desc"
  );
  res.json(result);
}

function getAddCustomer(req, res) {
  res.render("customers/form", { data: {}, username: req.session.user.name });
}

function getEditCustomer(req, res) {
  const id = req.params.id;
  Customer.get(id).then((data) => {
    res.render("customers/form", { data, username: req.session.user.name });
  });
}

function addCustomer(req, res) {
  const { name, address, phone } = req.body;

  Customer.create(name, address, phone).then(() => {
    res.redirect("/customers");
  });
}

function editCustomer(req, res) {
  const id = req.params.id;
  const { name, address, phone } = req.body;

  Customer.update(name, address, phone, id).then(() => {
    res.redirect("/customers");
  });
}

function deleteCustomer(req, res) {
  const id = req.params.id;
  Customer.del(id).then(res.redirect("/customers"));
}

module.exports = {
  getCustomer,
  getAddCustomer,
  getEditCustomer,
  addCustomer,
  editCustomer,
  deleteCustomer,
  getCustomerAPI,
};
