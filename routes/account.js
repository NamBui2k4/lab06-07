const router = require("express").Router();
const account = require("../controllers/accountController");

router.get("/", (req, res) => {
    if (req.session.user) return res.redirect("/files/");
    return res.redirect("/login");
});

router.get("/login", account.showLogin);
router.post("/login", account.login);

router.get("/register", account.showRegister);
router.post("/register", account.register);

router.get("/logout", account.logout);

module.exports = router;
