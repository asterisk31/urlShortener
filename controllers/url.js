const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateShortUrl(req, resp) {
  const body = req.body;
  if (!body.url) return resp.status(400).json({ error: "url is required" });
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
  });

  return resp.json({ id: shortID });
}

async function handleGetAnalytics(req, resp) {
  const shortId = req.params.shortid;
  //console.log(shortId);
  const result = await URL.findOne({
    shortId,
  });
  console.log(result);
  if (!result) return resp.status(400).json({ error: "not a valid result" });
  return resp.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortUrl,
  handleGetAnalytics,
};
