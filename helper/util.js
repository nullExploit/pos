module.exports = hasSession = (req, res, next) => {
  if (req.session.user) return next();
  else res.redirect("/");
};