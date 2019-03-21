var express = require('express');
var router = express.Router();

const puppeteer = require('puppeteer');

const url = 'https://stockx.com/adidas-yeezy-boost-350-v2-cream-white'

/* GET home page. */
router.get('/', function(req, res, next) {
  puppeteer
    .launch()
    .then((browser) => {
        return browser.newPage();
    })
    .then((page) => {
        return page.goto(url).then(function() {
            return page.content();
        })
    })
    .then((html) => {
        console.log(html)
        return res.send('Finished');
    })
    .catch((err) => {
        console.log(err);
    })
});

module.exports = router;
