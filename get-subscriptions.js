const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function getSaltSubs(team) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(`https://salt.bountysource.com/teams/${ team }/supporters`);

    await page.waitFor(2000);

    const data = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('table tr'))
      console.log('got all trs?', trs);
      return trs
        // remove header
        .slice(1)
        .map((tr) => ({
          username: tr.querySelector('td:nth-of-type(2)').innerHTML,
          thisMonth: tr.querySelector('td:nth-of-type(3)').innerHTML,
          thisMonthNum: +tr.querySelector('td:nth-of-type(3)').innerHTML.slice(1),
          allTime: tr.querySelector('td:nth-of-type(4)').innerHTML,
          allTimeNum: +tr.querySelector('td:nth-of-type(4)').innerHTML.slice(1)
        }));
    });

    await browser.close();
    return data;
}

module.exports = { getSaltSubs };
