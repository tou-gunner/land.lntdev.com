require('dotenv').config();
const fs = require('fs');
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3010;
const app = next({ dev: false });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
