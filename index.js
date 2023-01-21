const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false })); // This will parse data for POST requests, which are hidden in the request body

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  let abPath = __dirname + "/views/index.html";
  res.sendFile(abPath);
});

let urlDB = new Map(); // database - url : short_url map
let shorturlDB = new Map(); // database - short_url : url map

app.post("/api/shorturl", (req, res) => {
  console.log(`url post: ${req.body.url}`);
  let uEntry = req.body.url ? req.body.url : "";
  let urlRegex = /(?<=https:\/\/)[\w\/\.\-]+(?=\/\?)/;
  let urlRegexB = /(?<=https:\/\/)[\w\/\.\-]+/;
  let urlMatch = uEntry.match(urlRegex) ? uEntry.match(urlRegex) : uEntry.match(urlRegexB);
  urlPost = urlMatch ? urlMatch[0] : "invalidURL";
  console.log(`hostname: ${urlPost}`);
  dns.lookup(urlPost, (err, address, family) => {
    if (!err) { // urlPost is a valid url
      if (urlDB.has(uEntry)) { // urlPost already exists in DB
        console.log(`Already in DB : ${urlDB.get(uEntry)} ----------`);
        res.json({
          "original_url": uEntry,
          "short_url": urlDB.get(uEntry)
        });
      } else { // urlPost is new
        let shortURL = createShortURL(5); // create new short_url
        urlDB.set(uEntry, shortURL);
        shorturlDB.set(shortURL, uEntry);
        console.log(`New url entry created : ${shortURL} ---------`);
        res.json({
          "original_url": uEntry,
          "short_url": shortURL
        });
      }
    } else {
      console.log("Invalid url ---------");
      res.json({ "error": "invalid url" });
    }
  });
});

app.get("/api/shorturl/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  console.log(`GET short_url: ${shortURL} --------`)
  let origURL = shorturlDB.get(shortURL);
  console.log(`original_url: ${origURL} --------`)
  res.redirect(origURL);
});

// listen for requests :)
const port = process.env.PORT || 3000;
 app.listen(port, function() {
  console.log(`Your app is listening on port ${port} ...`);
});

const createShortURL = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const chrCnt = chars.length;
  let shortURL = "";

  for (let i = 0; i < length; i++) {
    let index = Math.round(Math.random() * chrCnt);
    shortURL += chars[index];
  }

  if (!shorturlDB.has(shortURL)) {
    return shortURL;
  } else {
    shortURL = createShortURL(length);
  }

  return shortURL;
}