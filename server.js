require('dotenv').config();
const fs = require('fs');
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Check if we're in standalone mode (Next.js 12+) or regular mode
const isStandalone = !dev && fs.existsSync('./.next/standalone');

const app = next({ 
  dev,
  // Use the correct directory structure based on standalone mode
  dir: isStandalone ? './' : process.cwd()
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`Server running on port ${port} (${isStandalone ? 'standalone mode' : 'regular mode'})`);
  });
});
