const User = require("../models/User");

function getIndex(req, res) {
  res.render("index", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
}

function getRegister(req, res) {
  res.render("register", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
}

function postIndex(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("failedMessage", "Please input your credentials!");
    res.redirect("/");
  } else {
    User.get(email).then((data) => {
      if (!data) {
        req.flash("failedMessage", "User not found!");
        res.redirect("/");
      } else {
        User.login(email, password).then((match) => {
          if (!match) {
            req.flash("failedMessage", "Your password is incorrect!");
            res.redirect("/");
          } else {
            req.session.user = {
              id: data.userid,
              email: data.email,
              name: data.name,
            };
            res.redirect("/dashboard");
          }
        });
      }
    });
  }
}

function postRegister(req, res) {
  const { firstName, lastName, email, password, retypePassword } = req.body;
  if (!firstName || !lastName || !email || !password || !retypePassword) {
    req.flash("failedMessage", "Fill the field");
    res.redirect("/register");
  } else {
    const fullName = `${firstName} ${lastName}`
      .split(" ")
      .map((name) => {
        return name.replace(name[0], name[0].toUpperCase());
      })
      .join(" ");

    User.get(email).then((data) => {
      if (data.email) {
        req.flash("failedMessage", "Email already taken!");
        res.redirect("/register");
      } else {
        if (password != retypePassword) {
          req.flash("failedMessage", "Password does'nt match!");
          res.redirect("/register");
        } else {
          User.register(email, fullName, password).then(
            req.flash("successMessage", "Please log in here"),
            res.redirect("/")
          );
        }
      }
    });
  }
}

module.exports = { getIndex, getRegister, postIndex, postRegister };
