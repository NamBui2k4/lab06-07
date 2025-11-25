const express = require("express");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const AccountRouter = require("./routes/account");
const FileRouter = require("./routes/file");

const app = express();

// cấu hình ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// CSRF PROTECTION (skip upload)
const csrfProtection = csrf();

app.use((req, res, next) => {
    const skip = [
        "/files/upload",
        "/files/new-folder",
        "/files/create-text",
        "/files/rename",
        "/files/delete"
    ];

    // Skip CSRF for these routes
    if (skip.includes(req.path)) {
        req.csrfToken = null;
        return next();
    }

    return csrfProtection(req, res, next);
});

// global locals
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : "";
    res.locals.session = req.session;
    res.locals.flash = req.flash();
    next();
});
// routes
app.use("/", AccountRouter);
app.use("/files", FileRouter);

// 404
app.use((req, res) => {
  res.status(404).render("error");
});

// start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
