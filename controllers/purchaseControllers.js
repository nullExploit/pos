const Purchase = require("../models/Purchase");
const PurchaseItem = require("../models/PurchaseItem");
const Good = require("../models/Good");
const Supplier = require("../models/Supplier");

function getPurchase(req, res) {
  res.render("purchases/view", { username: req.session.user.name });
}

async function getPurchaseAPI(req, res) {
  const { draw, length, start, search } = req.query;
  const result = await Purchase.all(
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

function getAddPurchase(req, res) {
  Good.getAll().then((dataGood) => {
    PurchaseItem.inv().then((dataInv) => {
      Supplier.getAll().then((dataSup) => {
        res.render("purchases/form", {
          dataGood,
          dataInv,
          dataSup,
          username: req.session.user.name,
          userid: req.session.user.id,
        });
      });
    });
  });
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
          username: dataInv.username,
          userid: dataInv.userid,
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

  const result = await PurchaseItem.create(
    invoice,
    itemcode,
    quantity,
    purchaseprice,
    totalprice
  );

  res.status(201).json(result);
}

function addPurchase(req, res) {
  const { invoice, time, totalsum, supplier, operator } = req.body;

  Purchase.create(invoice, time, totalsum, supplier, operator).then(() => {
    res.redirect("/purchases");
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
  Purchase.del(id).then(res.redirect(`/purchases/deleteitems/${id}`));
}

function deletePurchaseItem(req, res) {
  const id = req.params.id;
  const iditems = req.params.iditems;
  PurchaseItem.del(Number(iditems)).then(res.redirect(`/purchases/edit/${id}`));
}

function deletePurchaseItemAll(req, res) {
  const id = req.params.id;
  PurchaseItem.delAll(id).then(res.redirect("/purchases"));
}

module.exports = {
  getPurchase,
  getAddPurchase,
  getEditPurchase,
  addPurchase,
  editPurchase,
  deletePurchase,
  getPurchaseAPI,
  addPurchaseItem,
  getPurchaseItemAPI,
  deletePurchaseItem,
  deletePurchaseItemAll,
};
