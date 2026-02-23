const express = require("express");
const cors = require("cors");
const { createClient } = require("webdav");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
  try {
    const { url, username, password, filename, content } = req.body;

    const client = createClient(url, {
      username,
      password
    });

    await client.putFileContents(filename, content);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Keenetic WebDAV API çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});