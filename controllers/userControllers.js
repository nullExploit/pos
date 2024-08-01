const User = require("../models/User");

function getIndex(req, res) {
  res.render("index", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
}

function postIndex(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("failedMessage", "Please input your credentials!");
    return res.redirect("/");
  }

  User.get(email).then((data) => {
    if (!data.email) {
      req.flash("failedMessage", "User not found!");
      return res.redirect("/");
    }

    User.login(email, password).then((match) => {
      if (!match) {
        req.flash("failedMessage", "Your password is incorrect!");
        return res.redirect("/");
      }
      req.session.user = {
        id: data.userid,
        email: data.email,
        name: data.name,
        role: data.role
      };
      return res.redirect("/dashboard");
    });
  });
}

function getUser(req, res) {
  res.render("users/view", {
    username: req.session.user.name,
    role: req.session.user.role,
  });
}

async function getUserAPI(req, res) {
  const { draw, length, start, search, columns, order } = req.query;

  const result = await User.all(
    search?.value,
    search?.value,
    search?.value,
    search?.value,
    draw,
    length,
    start,
    columns ? columns[order[0].column].data : "userid",
    order ? order[0].dir : "desc"
  );
  res.json(result);
}

function getAddUser(req, res) {
  res.render("users/form", {
    data: {},
    username: req.session.user.name,
    role: req.session.user.role,
  });
}

function getEditUser(req, res) {
  const id = req.params.id;
  User.getId(id).then((data) => {
    res.render("users/form", {
      data,
      username: req.session.user.name,
      role: req.session.user.role,
    });
  });
}

function addUser(req, res) {
  const { email, name, password, role } = req.body;

  User.register(email, name, password, role).then(() => {
    res.redirect("/users");
  });
}

function editUser(req, res) {
  const id = req.params.id;
  const { email, name, role } = req.body;

  User.update(id, email, name, role).then(() => {
    res.redirect("/users");
  });
}

function deleteUser(req, res) {
  const id = req.params.id;
  User.del(id).then(res.redirect("/users"));
}

function getProfile(req, res) {
  User.getId(req.session.user.id).then((data) => {
    data.operation = "Profile";
    res.render("users/form", {
      data,
      username: req.session.user.name,
      role: req.session.user.role,
      failedMessage: req.flash("failedMessage"),
      successMessage: req.flash("successMessage"),
    });
  });
}

function getPassword(req, res) {
  res.render("users/form", {
    data: { operation: "Change Password" },
    username: req.session.user.name,
    role: req.session.user.role,
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
}

function changeProfile(req, res) {
  const id = req.session.user.id;
  const { email, name } = req.body;

  req.session.user.name = name;
  req.session.user.email = email;

  User.update(id, email, name).then(() => {
    req.flash("successMessage", "Your profile has been updated");
    res.redirect("/users/profile");
  });
}

function changePassword(req, res) {
  const { oldpass, newpass, retypepass } = req.body;
  const { id, email } = req.session.user;

  User.login(email, oldpass).then((data) => {
    if (!data) {
      req.flash("failedMessage", "Your password is incorrect!");
      return res.redirect("/users/changepassword");
    }

    if (newpass != retypepass) {
      req.flash("failedMessage", "Password does'nt match!");
      return res.redirect("/users/changepassword");
    }

    User.changepass(id, oldpass, newpass).then(
      req.flash("successMessage", "Your password has been updated"),
      res.redirect("/users/changepassword")
    );
  });
}

module.exports = {
  getIndex,
  postIndex,
  addUser,
  getEditUser,
  getUser,
  getAddUser,
  editUser,
  deleteUser,
  getUserAPI,
  getProfile,
  getPassword,
  changeProfile,
  changePassword,
};
