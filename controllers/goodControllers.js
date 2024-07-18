const Good = require("../models/Good");
const Unit = require("../models/Unit");
const path = require("path");
const { readdirSync, unlinkSync } = require("node:fs");

function getGood(req, res) {
  Good.all().then((datas) => {
    res.render("goods/view", {
      datas,
      username: req.session.user.name,
    });
  });
}

function getAddGood(req, res) {
  Unit.all().then((dataUnit) => {
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
    Unit.all().then((dataUnit) => {
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

  for (let file of readdirSync(
    path.join(__dirname, "..", "public", "uploads")
  )) {
    if (file.split("-")[1] == id) {
      unlinkSync(path.join(__dirname, "..", "public", "uploads", file));
    }
  }

  const file = req.files.goodPicture;
  const filename = `${Date.now()}-${barcode}-${file.name}`;
  const filepath = path.join(__dirname, "..", "public", "uploads", filename);

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
};
