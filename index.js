const _ = require('lodash');
const subscriptions = require('./get-subscriptions');

module.exports = async function (req, res) {
  try {

    const url = _.trimEnd(req.url, '/');
    const teamName = url.replace(/^.*\//, '');

    if (!teamName) { throw new Error('no team name!'); }

    const data = await subscriptions.getSaltSubs(teamName);

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
      label: 'monthly salt',
      message: `$ ${ monthlySum }`,
      color: "#33ccff",
      style: 'for-the-badge'
    }));

  } catch (e) {
    res.statusCode = 200;
    res.setHeader('Content-Type', `application/json`);
    res.end(JSON.stringify({
      schemaVersion: 1,
      isError: true,
      label: 'monthly salt',
      message: `unknown`,
      color: "#33ccff",
      style: 'for-the-badge'
    }));
    console.error('Server Error!', e);
  }
};
