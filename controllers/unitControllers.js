const Unit = require("../models/Unit");

function getUnit(req, res) {
  Unit.all().then((datas) => {
    res.render("units/view", { datas, username: req.session.user.name });
  });
}

function getAddUnit(req, res) {
  res.render("units/form", { data: {}, username: req.session.user.name });
}

function getEditUnit(req, res) {
  const id = req.params.id;
  Unit.get(id).then((data) => {
    res.render("units/form", { data, username: req.session.user.name });
  });
}

function addUnit(req, res) {
  const { unit, name, note } = req.body;

  Unit.create(unit, name, note).then(() => {
    res.redirect("/units");
  });
}

function editUnit(req, res) {
  const id = req.params.id;
  const { unit, name, note } = req.body;

  Unit.update(unit, id, name, note).then(() => {
    res.redirect("/units");
  });
}

function deleteUnit(req, res) {
  const id = req.params.id;
  Unit.del(id).then(res.redirect("/units"));
}

module.exports = {
  getUnit,
  getAddUnit,
  getEditUnit,
  addUnit,
  editUnit,
  deleteUnit,
};
