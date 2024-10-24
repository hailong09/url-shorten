require('dotenv').config();
const bodyparser = require('body-parser');
const dns = require('dns')
const url = require('url')
const express = require('express');
const cors = require('cors');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
const urls = []
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  console.log(req.body.url)
  var hostname = url.parse(req.body.url).hostname
  if (!hostname) {
    res.json({ 'error': 'Invalid URL' });
    return;
  }
  dns.lookup(hostname, function (err, host, family) {
    if (err) {
      res.json({ 'error': 'Invalid URL' })
      return;
    }
    urls.push(req.body.url)
    res.json(
      {
        original_url: req.body.url,
        short_url: urls.indexOf(req.body.url) + 1
      }
    )

  })
})

app.get('/api/shorturl/:id', function (req, res) {
  const externalUrl = urls[req.params.id - 1];
  res.redirect(externalUrl);

})
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
