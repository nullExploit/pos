function getDashboard(req, res) {
  res.render("dashboard", { username: req.session.user.name });
}

function getLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { getDashboard, getLogout };
