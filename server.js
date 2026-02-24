const express = require("express");
const cors = require("cors");
const { createClient } = require("webdav");
const multer = require("multer");
const https = require("https");

const app = express();
app.use(cors());
app.use(express.json());

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const client = createClient(
  "https://datacitycenter.keenetic.pro/webdav/",
  {
    username: "manfile",
    password: "datamanfile@.",
    httpsAgentOptions: { rejectUnauthorized: false },
    httpsAgent
  }
);

const upload = multer({ storage: multer.memoryStorage() });

app.get("/list", async (req, res) => {
  try {
    const files = await client.getDirectoryContents("/");
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await client.putFileContents("/" + req.file.originalname, req.file.buffer);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const { filename } = req.body;
    await client.deleteFile("/" + filename);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/download", async (req, res) => {
  try {
    const { filename } = req.query;
    const fileContents = await client.getFileContents("/" + filename);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(fileContents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Render’da çalışmak için PORT kullanıyoruz
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
