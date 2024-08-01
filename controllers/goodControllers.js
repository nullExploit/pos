const Good = require("../models/Good");
const Unit = require("../models/Unit");
const path = require("path");
const { readdirSync, unlinkSync } = require("node:fs");

function getGood(req, res) {
  res.render("goods/view", {
    username: req.session.user.name,
  });
}

async function getGoodAPI(req, res) {
  const { draw, length, start, search, columns, order } = req.query;
  const result = await Good.all(
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    draw,
    length,
    start,
    columns ? columns[req.query.order[0].column].data : "barcode",
    order ? order[0].dir : "desc"
  );
  res.json(result);
}

function getGoodPurchaseAPI(req, res) {
  Good.getAll().then(data => {
    res.json(data)
  })
}

function getAddGood(req, res) {
  Unit.getAll().then((dataUnit) => {
    res.render("goods/form", {
      data: {},
      username: req.session.user.name,
      dataUnit,
    });
  });
}

function getEditGood(req, res) {
  const id = req.params.id;
  Good.get(id).then((data) => {
    Unit.getAll().then((dataUnit) => {
      res.render("goods/form", {
        data,
        username: req.session.user.name,
        dataUnit,
      });
    });
  });
}

function addGood(req, res) {
  const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;

  const file = req.files.goodPicture;
  const filename = `${Date.now()}-${barcode}-${file.name}`;
  const filepath = path.join(__dirname, "..", "public", "uploads", filename);

  file.mv(filepath, (e) => {
    if (e) return console.log(e);
    Good.create(
      barcode,
      name,
      stock,
      purchaseprice,
      sellingprice,
      unit,
      filename
    ).then(() => {
      res.redirect("/goods");
    });
  });
}

function editGood(req, res) {
  const id = req.params.id;
  const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;

  const file = req.files?.goodPicture;
  const filename = `${Date.now()}-${barcode}-${file?.name}`;
  const filepath = path.join(__dirname, "..", "public", "uploads", filename);

  if (file) {
    for (let file of readdirSync(
      path.join(__dirname, "..", "public", "uploads")
    )) {
      if (file.split("-")[1] == id) {
        unlinkSync(path.join(__dirname, "..", "public", "uploads", file));
      }
    }
    file.mv(filepath, (e) => {
      if (e) return console.log(e);
      Good.update(
        barcode,
        id,
        name,
        stock,
        purchaseprice,
        sellingprice,
        unit,
        filename
      ).then(() => {
        res.redirect("/goods");
      });
    });
  } else {
    Good.update(
      barcode,
      id,
      name,
      stock,
      purchaseprice,
      sellingprice,
      unit
    ).then(() => {
      res.redirect("/goods");
    });
  }
}

function deleteGood(req, res) {
  const id = req.params.id;

  for (let file of readdirSync(
    path.join(__dirname, "..", "public", "uploads")
  )) {
    if (file.split("-")[1] == id) {
      unlinkSync(path.join(__dirname, "..", "public", "uploads", file));
    }
  }

  Good.del(id).then(res.redirect("/goods"));
}

module.exports = {
  getGood,
  getAddGood,
  getEditGood,
  addGood,
  editGood,
  deleteGood,
  getGoodAPI,
  getGoodPurchaseAPI
};
