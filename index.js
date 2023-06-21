const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk/climate-change",
  },
  ,
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    html = response.data;
    const $ = cheerio.load(html);

    //searchParam = `${html.match(/climate/gi)}`

    $("a:contains('climate')", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        source: newspaper.name,
        title,
        url: newspaper.base + url,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to this climate change news api");
});
app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;
  //console.log(newspaperAddress);

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const specificArticles = [];

      $("a:contains('climate')", html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        specificArticles.push({
          title,
          url: newspaperBase,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
