const puppeteer = require('puppeteer');

module.exports = async function (req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto(`https://salt.bountysource.com/teams/kibibit/supporters`);

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

    console.log(data);

    const monthlySum = data.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.thisMonthNum;
    }, 0);

    console.log('TOTAL SUM: ', monthlySum);

    await browser.close();

    res.statusCode = 200;
    res.setHeader('Content-Type', `text`);
    res.end(monthlySum);

  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    console.error(e.message);
  }
};
