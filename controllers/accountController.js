
const bcrypt = require("bcrypt");
const db = require("../database/db");

module.exports = {
  showLogin(req, res) {
    if (req.session.user) return res.redirect("/files/");
    res.render("login");
    } ,

  async login(req, res) {
    const { username, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
    if (rows.length === 0) {
      req.flash("error", "User không tồn tại");
      return res.redirect("/login");
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      req.flash("error", "Sai mật khẩu!");
      return res.redirect("/login");
    }

    req.session.user = user;
    res.redirect("/files/");
  },

  showRegister(req, res) {
    if (req.session.user) return res.redirect("/files/");
    res.render("register");
  },

  async register(req, res) {
    const { fullname, email, username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users SET ?", {
      fullname,
      email,
      username,
      password: hash
    });

    req.flash("success", "Đăng ký thành công, hãy đăng nhập!");
    res.redirect("/login");
  },

  logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
