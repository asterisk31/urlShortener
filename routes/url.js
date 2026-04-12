const express = require("express");
const {
  handleGenerateShortUrl,
  handleGetAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateShortUrl);

router.get("/analytics/:shortid", handleGetAnalytics);

module.exports = router;
