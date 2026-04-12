const express = require("express");

const { connectToMongo } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 2005;

connectToMongo("mongodb://localhost:27017/shortUrl")
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("error:", err));

app.use(express.json());

app.use("/url", urlRoute);

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
  if(!entry){
    return resp.status(404).json({"error": "URL not found"})
  }
  console.log(entry);
  return resp.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log("server started at ", PORT));
