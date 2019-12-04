const express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  compression = require("compression"),
  helmet = require("helmet"),
  logger = require("morgan");

require("dotenv").config();

var usersRouter = require("./routes/users");
var libraryRouter = require("./routes/library");

var app = express();

app.use(compression());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/library", libraryRouter);

module.exports = app;
