module.exports = checkRole = (req, res, next) => {
  if (req.session.user.role == "admin") return next();
  else res.redirect("/sales");
};
