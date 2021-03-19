const puppeteer=require('puppeteer');
const readline = require('readline');
require('dotenv').config();

var username = process.env.USERNAME;

var password = process.env.PASSWORD;

const envs = ['test', 'prod'];

const data =
  {
    test: {
      url: 'https://graylog3.jtiweb.co.uk/streams/5e4d2a9b7fa7b70012084990/search',
      query: [
        'market:hdlsde AND environment:test AND file:exception.log',
        'market:hdlsch AND environment:test AND file:exception.log',
        'market:hdlsro AND environment:test AND file:exception.log',
        'market:hdlsgr AND environment:test AND file:exception.log',
        'market:hdlsie AND environment:test AND file:exception.log',
        'market:hdlsca AND environment:test AND file:exception.log',
        'market:hdlsuk AND environment:test AND file:exception.log',
        'market:hdlsfr AND environment:test AND file:exception.log',
        'market:hdlsnl AND environment:test AND file:exception.log',
        'market:hdlses AND environment:test AND file:exception.log',
      ]
    },
    prod: {
      url: 'https://graylog3.jtiweb.co.uk/streams/5e4d2e4b7fa7b70012084d9d/search',
      query: [
        'market:hdlsde AND environment:production AND file:exception.log',
        'market:hdlsch AND environment:production AND file:exception.log',
        'market:hdlsro AND environment:production AND file:exception.log',
        'market:hdlsgr AND environment:production AND file:exception.log',
        'market:hdlsie AND environment:production AND file:exception.log',
        'market:hdlsca AND environment:production AND file:exception.log',
        'market:hdlsuk AND environment:production AND file:exception.log',
        'market:hdlsfr AND environment:production AND file:exception.log',
        'market:hdlsnl AND environment:production AND file:exception.log',
        'market:hdlses AND environment:production AND file:exception.log',
      ]
    }
  };

(async()=>{
    
const browser=await puppeteer.launch({
    headless:false,
    args:[
      '--start-maximized'
   ]
});

const page = await browser.newPage();

await page.setViewport({ width: 1920, height: 1080});

await page.setDefaultNavigationTimeout(0); 

await page.goto('https://graylog3.jtiweb.co.uk/', {
    waitUntil: 'networkidle0',
  });

await page.waitForSelector('#username', {
    visible: true,
  });

await	page.type('#username',username);

await	page.type('#password',password);

await	page.click("#login-box-content button");

await	page.waitForNavigation();

for await (env of envs) {
  let url = data[env].url;
  let queries = data[env].query;

  for await (query of queries) {
    console.log(query);

    const page = await browser.newPage();
  
    await page.setViewport({ width: 1920, height: 1080});

    await page.setDefaultNavigationTimeout(0); 

    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: process.env.DOWNLOAD_DIRECTORY});
  
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
  
    await page.waitForSelector('#main-content-sidebar', {
        visible: true,
      });
  
    await page.click('#dropdown-timerange-selector');
  
    await page.click('#universalsearch .timerange-selector-container .timerange-chooser.pull-left.btn-toolbar > div > ul > li:nth-child(2) > a');
  
    await	page.type('#timerange-absolute-from', process.env.FROM_DATE);
  
    await	page.type('#timerange-absolute-to', process.env.TO_DATE);
  
    await	page.type('#search-field', query);
  
    await page.keyboard.press('Enter');

    await page.waitForSelector('#main-content-sidebar > div.alert.alert-info', {
      visible: true,
    });

    await page.waitForSelector('#main-content-sidebar > div.alert.alert-info', {
      visible: false,
    });
  
    await page.waitForSelector('#main-content-sidebar > div:nth-child(4) > ul > li:nth-child(5) > a', {
      visible: true,
    });
  
    await page.click('#main-content-sidebar > div:nth-child(4) > ul > li:nth-child(5) > a');
  
    await page.on('response', async (response) => {    
      if (response.url().includes('graylog3.jtiweb.co.uk/api/search/universal/absolute/histogram?query=')){
          response.json().then(data => {
            for (const property in data.results) {
                console.log(`${new Date(property * 1000).toLocaleDateString("en-US")}: ${data.results[property]}`);
              }
          });
      } 
    });
  
    await page.click('#search-more-actions-dropdown');
  
    await page.click('#sidebar > div > div.content-col > div:nth-child(1) > div > div:nth-child(3) > div > ul > li:nth-child(1) > a');
  
    await page.waitForSelector('body > div:nth-child(10) > div.fade.in.modal > div > div > div.modal-body > p:nth-child(2) > a', {
      visible: true,
    })
  
    await page.click('body > div:nth-child(10) > div.fade.in.modal > div > div > div.modal-body > p:nth-child(2) > a', {button: 'right'})
  
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  }
}

})();
