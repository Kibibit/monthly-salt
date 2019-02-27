const subscriptions = require('./get-subscriptions');

module.exports = async function (req, res) {
  try {

    const data = await subscriptions.getSaltSubs('kibibit');

    console.log('GOT THE FOLLOWING DATA: ', data);

    const monthlySum = data.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.thisMonthNum;
    }, 0);

    res.statusCode = 200;

    // set cache for 1 hour
    res.setHeader("Cache-Control", "public, max-age=2700");
    res.setHeader("Expires", new Date(Date.now() + 2700).toUTCString());

    res.setHeader('Content-Type', `application/json`);
    res.end(JSON.stringify({
      schemaVersion: 1,
      label: 'bountysource',
      message: `$${ monthlySum }`,
      color: "#33ccff",
      style: 'for-the-badge'
    }));

  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    console.error('BIG BIG ERROR!!!!', e);
  }
};
