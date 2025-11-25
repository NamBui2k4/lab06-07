const bcrypt = require("bcrypt");
const db = require("../database/db");

module.exports = {
  showLogin(req, res) {
    if (req.session.user) return res.redirect("/files/");
    res.render("login");
  },

  async login(req, res) {
    const { username, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE username=?", [
      username,
    ]);
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
    const { fullname, email, username, password, confirmPassword } = req.body;

    try {
      if (password !== confirmPassword) {
        req.flash("error", "password do not match");
        return res.redirect("/register");
      }

      const strongPass =
        /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{6,}$/;

      if (!strongPass.test(password)) {
        req.flash(
          "error",
          "Password must contain at least 1 number and 1 special character!"
        );
        return res.redirect("/register");
      }

      const [existing] = await db.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email]
      );

      if (existing.length > 0) {
        const user = existing[0];
        if (user.username === username) {
          req.flash("error", "Username already exists!");
        } else if (user.email === email) {
          req.flash("error", "Email already exists!");
        }

        return res.redirect("/register");
      }

      // 4. Hash password
      const hash = await bcrypt.hash(password, 10);

      // 5. Lưu user mới
      await db.query(
        "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
        [fullname, email, username, hash]
      );

      req.flash("success", "Register successfully! Please login.");
      res.redirect("/login");
    } catch (error) {
      console.error(err);
      req.flash("error", "Server error!");
      res.redirect("/register");
    }
  },

  logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  },
};
