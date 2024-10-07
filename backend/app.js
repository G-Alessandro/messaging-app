const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./utils/socket/socket");
require("dotenv").config();

const indexRouter = require("./routes/index");

const mongoDB = process.env.MONGODB_URI;
const allowedOrigin = process.env.ALLOWED_ORIGIN;
const sessionSecret = process.env.SESSION_SECRET;

const app = express();

app.set("trust proxy", 1);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
socketHandler(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
      sameSite: "none",
    },
    // store: new MongoDBStore({
    //   uri: mongoDB,
    //   collectionName: "sessions",
    // }),
  })
);

//Sistemare rimozione immaggini dalle chat di gruppo
//Sistemare coockie on database

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // return JSON response
  res.status(err.status || 500).json({
    message: err.message,
    error: res.locals.error,
  });
});

module.exports = app;
