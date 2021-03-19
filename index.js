const puppeteer=require('puppeteer');
const readline = require('readline');

var username="";

var password="";

(async()=>{
    
const browser=await puppeteer.launch({
    headless:false
});

const page=await browser.newPage();

await page.setViewport({ width: 1366, height: 768});

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

await page.waitForSelector('#main-content-sidebar', {
    visible: true,
  });

await page.click('#dropdown-timerange-selector');

await page.click('#universalsearch .timerange-selector-container .timerange-chooser.pull-left.btn-toolbar > div > ul > li:nth-child(2) > a');

await	page.type('#timerange-absolute-from', '2021-03-15 00:00:00');

await	page.type('#timerange-absolute-to', '2021-03-20 00:00:00');

await	page.type('#search-field', 'market:hdlsde AND environment:test AND file:exception.log');

await page.keyboard.press('Enter');

await page.waitForSelector('#main-content-sidebar > div:nth-child(4) > ul > li:nth-child(5) > a', {
  visible: true,
})

await page.click('#main-content-sidebar > div:nth-child(4) > ul > li:nth-child(5) > a');

page.on('response', async (response) => {    
  if (response.url().includes('graylog3.jtiweb.co.uk/api/search/universal/absolute/histogram?query=')){
      response.json().then(data => {
        console.log(data.results);
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
})();
