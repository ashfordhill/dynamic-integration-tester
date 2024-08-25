const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ defaultViewport: { width: 1920, height: 1080 }});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();