const Sale = require("../models/Sale");
const SaleItem = require("../models/SaleItem");
const Good = require("../models/Good");
const Customer = require("../models/Customer");

function getSale(req, res) {
  res.render("sales/view", {
    username: req.session.user.name,
    userid: req.session.user.id,
  });
}

async function getSaleAPI(req, res) {
  const { draw, length, start, search } = req.query;
  const result = await Sale.all(
    search.value,
    search.value,
    search.value,
    search.value,
    search.value,
    search.value,
    draw,
    length,
    start,
    req.query.columns[req.query.order[0].column].data,
    req.query.order[0].dir
  );
  res.json(result);
}

function getEditSale(req, res) {
  const id = req.params.id;
  Good.getAll().then((dataGood) => {
    Sale.get(id).then((dataInv) => {
      Customer.getAll().then((dataCus) => {
        res.render("sales/form", {
          dataGood,
          dataInv,
          dataCus,
          username: dataInv?.username,
          userid: dataInv?.userid,
        });
      });
    });
  });
}

function getSaleItemAPI(req, res) {
  const { invoice } = req.query;

  SaleItem.all(invoice).then((datas) => {
    res.json(datas);
  });
}

async function addSaleItem(req, res) {
  const { invoice, itemcode, quantity, sellingprice, totalprice } = req.body;

  await SaleItem.create(invoice, itemcode, quantity, sellingprice, totalprice);

  res.status(201).json();
}

function addSale(req, res) {
  const { customer, operator } = req.body;

  Sale.create(customer, operator).then(() => {
    Sale.getLast().then((invoice) => {
      res.status(201).json({ invoice });
    });
  });
}

function editSale(req, res) {
  const id = req.params.id;
  const { totalsum, pay, change, customer } = req.body;

  Sale.update(totalsum, pay, change, customer, id).then(() => {
    res.status(201).json();
  });
}

function deleteSale(req, res) {
  const id = req.params.id;
  Sale.del(id).then(res.redirect("/sales"));
}

function deleteSaleItem(req, res) {
  const id = req.params.id;
  const iditems = req.params.iditems;
  SaleItem.del(Number(iditems)).then(res.redirect(`/sales/edit/${id}`));
}

module.exports = {
  getSale,
  getEditSale,
  addSale,
  editSale,
  deleteSale,
  getSaleAPI,
  addSaleItem,
  getSaleItemAPI,
  deleteSaleItem,
};
