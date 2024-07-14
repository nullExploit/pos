function getUser(req, res) {
  res.render("pages/users", {
    path: req.baseUrl,
    username: req.session.user.name,
  });
}

function getDashboard(req, res) {
  res.render("pages/dashboard", { path: {}, username: req.session.user.name });
}

function getLogout(req, res) {
    req.session.destroy(() => {
        res.redirect("/")
    })
}

module.exports = { getUser, getDashboard, getLogout };
