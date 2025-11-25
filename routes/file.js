const router = require("express").Router();
const fileController = require("../controllers/fileController");

// middleware check login
function auth(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    next();
}

router.get("/", auth, fileController.showHome);
router.get("/open", auth, fileController.openFile);
router.get("/download", auth, fileController.download);
router.post("/upload", auth, fileController.upload);
router.post("/create-text", auth, fileController.createText);
router.post("/new-folder", auth, fileController.newFolder);
router.post("/rename", auth, fileController.rename);
router.post("/delete", auth, fileController.deleteItem);
router.get("/zip", auth, fileController.downloadFolderZip);

module.exports = router;
