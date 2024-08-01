const Purchase = require("../models/Purchase");
const PurchaseItem = require("../models/PurchaseItem");
const Good = require("../models/Good");
const Supplier = require("../models/Supplier");

function getPurchase(req, res) {
  res.render("purchases/view", {
    username: req.session.user.name,
    role: req.session.user.role,
    userid: req.session.user.id,
  });
}

async function getPurchaseAPI(req, res) {
  const { draw, length, start, search, columns, order } = req.query;
  const result = await Purchase.all(
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    draw,
    length,
    start,
    columns ? columns[req.query.order[0].column].data : "invoice",
    order ? order[0].dir : "desc"
  );
  res.json(result);
}

function getEditPurchase(req, res) {
  const id = req.params.id;
  Good.getAll().then((dataGood) => {
    Purchase.get(id).then((dataInv) => {
      Supplier.getAll().then((dataSup) => {
        res.render("purchases/form", {
          dataGood,
          dataInv,
          dataSup,
          username: dataInv?.username,
          role: req.session.user.role,
          userid: dataInv?.userid,
        });
      });
    });
  });
}

function getPurchaseItemAPI(req, res) {
  const { invoice } = req.query;

  PurchaseItem.all(invoice).then((datas) => {
    res.json(datas);
  });
}

async function addPurchaseItem(req, res) {
  const { invoice, itemcode, quantity, purchaseprice, totalprice } = req.body;

  await PurchaseItem.create(
    invoice,
    itemcode,
    quantity,
    purchaseprice,
    totalprice
  );

  res.status(201).json();
}

function addPurchase(req, res) {
  const { supplier, operator } = req.body;

  Purchase.create(supplier, operator).then(() => {
    Purchase.getLast().then((invoice) => {
      res.status(201).json({ invoice });
    });
  });
}

function editPurchase(req, res) {
  const id = req.params.id;
  const { totalsum, supplier } = req.body;

  Purchase.update(totalsum, supplier, id).then(() => {
    res.status(201).json();
  });
}

function deletePurchase(req, res) {
  const id = req.params.id;
  Purchase.del(id).then(res.redirect("/purchases"));
}

function deletePurchaseItem(req, res) {
  const id = req.params.id;
  const iditems = req.params.iditems;
  PurchaseItem.del(Number(iditems)).then(res.redirect(`/purchases/edit/${id}`));
}

module.exports = {
  getPurchase,
  getEditPurchase,
  addPurchase,
  editPurchase,
  deletePurchase,
  getPurchaseAPI,
  addPurchaseItem,
  getPurchaseItemAPI,
  deletePurchaseItem,
};
