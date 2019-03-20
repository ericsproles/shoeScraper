var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var async = require('async');

const puppeteer = require('puppeteer');
const $ = require('cheerio');

const photoAngles = ['01', '06', '10', '15', '20']

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scrape', { title: 'Scrape' });
});

module.exports = router;
