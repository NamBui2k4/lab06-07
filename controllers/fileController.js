const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const multer = require("multer");

const ROOT = path.join(__dirname, "..", "uploads");

// multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, ROOT),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).single("file");

function buildPath(reqPath) {
  if (!reqPath) return ROOT;
  return path.join(ROOT, reqPath);
}

// đọc danh sách file + folder
function getItems(dir) {
  const items = fs.readdirSync(dir);

  return items.map((name) => {
    const fullPath = path.join(dir, name);
    const stat = fs.statSync(fullPath);

    return {
      name,
      isFolder: stat.isDirectory(),
      size: stat.isDirectory() ? "-" : stat.size + " bytes",
      modified: stat.mtime.toLocaleString(),
      fullPath: path.relative(ROOT, fullPath).replace(/\\/g, "/"),
      type: stat.isDirectory() ? "Folder" : getFileType(name),
    };
  });
}

function getFileType(name) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".txt") return "Text Document";
  if (ext === ".png" || ext === ".jpg") return "Image";
  if (ext === ".zip") return "Zip File";
  return "File";
}

module.exports = {
  // HIỂN THỊ TRANG HOME
  showHome(req, res) {
    const reqPath = req.query.path || "";
    const absPath = buildPath(reqPath);

    if (!fs.existsSync(absPath)) return res.redirect("/files");

    const items = getItems(absPath);

    // breadcrumb
    const parts = reqPath.split("/").filter((x) => x);
    const pathParts = [];
    let build = "";
    parts.forEach((p) => {
      build += (build === "" ? "" : "/") + p;
      pathParts.push({ name: p, fullPath: build });
    });

    res.render("index", {
      session: req.session,
      csrfToken: req.csrfToken(),
      items,
      pathParts,
      currentPath: reqPath,
    });
  },

  // MỞ FILE (xem file)
  openFile(req, res) {
    const filePath = buildPath(req.query.path);
    res.sendFile(filePath);
  },

  // UPLOAD
  upload(req, res) {
    upload(req, res, (err) => {
      if (err) return res.json({ error: err.message });
      return res.json({ success: true });
    });
  },

  // TẠO FOLDER
  newFolder(req, res) {
    const name = req.body.name;
    const parent = buildPath(req.body.path);

    const newDir = path.join(parent, name);
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);

    res.json({ success: true });
  },

  createText(req, res) {
    const name = req.body.name;
    const parent = buildPath(req.body.path);

    const filePath = path.join(parent, name + ".txt");

    fs.writeFileSync(filePath, ""); // tạo file rỗng
    res.json({ success: true });
  },

  // RENAME
  rename(req, res) {
    const oldPath = buildPath(req.body.oldPath);
    const newPath = path.join(path.dirname(oldPath), req.body.newName);

    fs.renameSync(oldPath, newPath);

    res.json({ success: true });
  },

  // DELETE
  deleteItem(req, res) {
    const itemPath = buildPath(req.body.path);

    function removeRecursive(p) {
      if (fs.statSync(p).isDirectory()) {
        fs.readdirSync(p).forEach((f) => {
          removeRecursive(path.join(p, f));
        });
        fs.rmdirSync(p);
      } else {
        fs.unlinkSync(p);
      }
    }

    removeRecursive(itemPath);

    res.json({ success: true });
  },

  // DOWNLOAD FILE
  download(req, res) {
    const filePath = buildPath(req.query.path);
    res.download(filePath);
  },

  // DOWNLOAD FOLDER AS ZIP
  downloadFolderZip(req, res) {
    const folder = buildPath(req.query.path);
    const zipName = req.query.path.replace("/", "_") + ".zip";
    const zipPath = path.join(ROOT, zipName);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip");

    output.on("close", () => {
      res.download(zipPath, zipName, () => {
        fs.unlinkSync(zipPath); // tự xoá ZIP sau khi download
      });
    });

    archive.pipe(output);
    archive.directory(folder, false);
    archive.finalize();
  },
};
