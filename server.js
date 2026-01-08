import express from "express";
import path from "path";
import basicAuth from "basic-auth";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, "dist");

/* -------------------------------------------------
   2️⃣ Allow sitemap XML without auth
-------------------------------------------------- */
app.use((req, res, next) => {
  if (/^\/sitemap.*\.xml$/i.test(req.path)) {
    return next();
  }
  next();
});

/* -------------------------------------------------
   3️⃣ BASIC AUTH (dev:Click123)
-------------------------------------------------- */
app.use((req, res, next) => {
  const credentials = basicAuth(req);
  if (!credentials || credentials.name !== "dev" || credentials.pass !== "Click123") {
    res.set("WWW-Authenticate", 'Basic realm="Secure Area"');
    return res.status(401).send("Access Denied");
  }
  next();
});

/* -------------------------------------------------
   4️⃣ ROOT → /ar/
-------------------------------------------------- */
app.get("/", (req, res) => {
  res.redirect(301, "/ar/");
});

/* -------------------------------------------------
   5️⃣ /en → index.html
-------------------------------------------------- */
app.get(/^\/en\/?$/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

/* -------------------------------------------------
   6️⃣ Serve static files
-------------------------------------------------- */
app.use(express.static(DIST_DIR));

/* -------------------------------------------------
   7️⃣ Extensionless URLs → .html
-------------------------------------------------- */
app.use((req, res, next) => {
  if (!path.extname(req.path)) {
    const htmlPath = path.join(DIST_DIR, req.path + ".html");
    res.sendFile(htmlPath, err => {
      if (err) next();
    });
  } else {
    next();
  }
});

/* -------------------------------------------------
   8️⃣ Custom 404
-------------------------------------------------- */
app.use((req, res) => {
  res.status(404).sendFile(path.join(DIST_DIR, "404.html"));
});

/* -------------------------------------------------
   START SERVER
-------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
