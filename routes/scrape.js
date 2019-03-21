var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var async = require('async');

const puppeteer = require('puppeteer');
const $ = require('cheerio');

const photoAngles = ['01', '06', '10', '15', '24', '28', '32']

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.query.url);
    console.log('it made it here')
    const html = await page.content();
    await browser.close();
    console.log('it made it heree')
    const results = await scrapeHtml(html);

    // app is currently failing here -----------
    await downloadImages(results.images, results.rawData.name);
    console.log('it made it hereeeeee')
    // GOT DATA
    // console.log(results);
    return res.json(results);
  }
  catch(e) {
    return res.status(500).json(e);
  }
});


function scrapeHtml(html) {
  let promise = new Promise((resolve, reject) => {
    // Gather info from Page
    const firstImageURL = $('.image-container img', html).attr('src');
    console.log('first image URLLL: ', firstImageURL)
    const rawData = $('script', html).get()[46].children[0].data;
    //console.log('raw data: ', rawData)
    const details = $('.product-details .detail span', html).text();
    console.log('details', details)
    if(!firstImageURL || !rawData) {
      console.log('rejected')
      reject();
    } 

    //Manipulate it
    const cleanImageURL = firstImageURL.substr(0, firstImageURL.indexOf('?'));
    //console.log('clean image URL: ', cleanImageURL)
    console.log($('script', html).get()[46].children[0].data)
    const readyData = JSON.parse(rawData);
    //console.log('readyData: ', readyData)
    const detailsObject = details.split(" ");

    //Generate Photo List
    const imageURLS = [];
    photoAngles.map((o, i) => {
      const newURL = cleanImageURL.replace('img01', `img${o}`);
      imageURLS.push(newURL);
      //console.log(newURL)
    })
    const returnObject = {
      rawData: readyData,
      images: imageURLS,
      retailPrice: detailsObject[detailsObject.indexOf('Price') + 1 ]
    }
    console.log('returnObject:', returnObject);
    resolve(returnObject);
  });
  return promise;
}

function downloadImages(urlArray, name) {
  let promise = new Promise((resolve, reject) => {    
    const cleanName = name.replace(/([^a-z0-9]+)/gi, '_');
    var dir = `./shoes/${cleanName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    async.eachOfSeries(urlArray, (image, i, callback) => {
      console.log('Downloing image ' + image);
      request
        .get(image)
        .on('error', (err) => {
          console.log('Error');
        })
        .on('response', (response) => {
          console.log(response);
        //STOP DOWNLOAD
        })
        .pipe(fs.createWriteStream(`${dir}/${cleanName}${i+1}.jpg`))
        .on('finish', () => {
          callback();
        })

    }, (err) => {
      if(err) console.log(err);
      resolve();
    });
  });
  return promise;
}


  module.exports = router;
  