var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("connect-flash");
var fileUpload = require("express-fileupload")

var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
var unitRouter = require("./routes/units")
var goodRouter = require("./routes/goods")
var supplierRouter = require("./routes/suppliers")
var purchaseRouter = require("./routes/purchases")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "rishad", saveUninitialized: true, resave: false }));
app.use(flash())
app.use(fileUpload())

app.use("/", indexRouter);
app.use("/users", userRouter)
app.use("/units", unitRouter)
app.use("/goods", goodRouter)
app.use("/suppliers", supplierRouter)
app.use("/purchases", purchaseRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
