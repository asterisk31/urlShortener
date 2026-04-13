const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectToMongo } = require("./connect");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 2005;

connectToMongo("mongodb://localhost:27017/shortUrl")
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, urlRoute); //inline middleware: will work only when req is on '/url'
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/:shortID", async (req, resp) => {
  const shortId = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
  );
  if (!entry) {
    return resp.status(404).json({ error: "URL not found" });
  }
  //console.log(entry);
  return resp.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log("server started at ", PORT));
