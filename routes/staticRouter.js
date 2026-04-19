//frontend pages are called static
const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

router.get("/", restrictTo(["ADMIN", "NORMAL"]), async (req, resp) => {
  //if (!req.user) return resp.redirect("/login");
  const allUrls = await URL.find({ createdBy: req.user._id });
  return resp.render("home", {
    urls: allUrls,
  });
});

router.get("/signup", (req, resp) => {
  return resp.render("signup");
});

router.get("/login", (req, resp) => {
  return resp.render("login");
});

module.exports = router;
