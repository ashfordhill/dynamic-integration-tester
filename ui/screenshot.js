const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({defaultViewport: null, headless: false});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();