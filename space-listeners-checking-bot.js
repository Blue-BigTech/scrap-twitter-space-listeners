const headerMessage = `
----------------------------------------------------
|       Twitter Space Listeners checking bot          |
----------------------------------------------------

`;

console.log(headerMessage);

console.log("Listeners profile Scraper bot");
console.log("Start checking...");
const puppeteer = require("puppeteer");
const chromePaths = require("chrome-paths");
const Chrome_Browser_PATH = chromePaths.chrome;
var fs = require("fs");
const _ = require("lodash");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var datafile = fs.readFileSync("./ryan-carson-followers-76898.json");
datafile = datafile.toString();
var datajson = JSON.parse(datafile);

var FileName = "valid";

var finalset = [];
const usersProfileDetails = async (start) => {
  const browser = await puppeteer.launch({
    executablePath: Chrome_Browser_PATH,
    headless: true,
    args: [
      "--disable-infobars",
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--start-maximized",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1920, height: 1008 });
  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (req.resourceType() === "image") {
      req.abort();
    } else {
      req.continue();
    }
  });
  var serials = 0;

  try {
    for (let index = start; index < datajson.length; index++) {
      const element = datajson[index].profile_url;
      //console.log(index + " -- Listeners profiles scraped");
      serials = index;

      await page.goto(element, { waitUntil: "domcontentloaded", timeout: 0 });

      await page.evaluate(() => {});

      await page.waitForSelector('[data-testid="tweet"]');

      var userIsValid = await page.evaluate(() => {
        var check = "";
        var bodyText = document.body.innerHTML;
        bodyText = bodyText.toLowerCase();
        if (
          bodyText.includes("#dailydose") ||
          bodyText.includes("daily dose") ||
          bodyText.includes("ryan carson") ||
          bodyText.includes("@ryancarson")
        ) {
          check = "valid";
        } else {
          check = "invalid";
        }

        return check;
      });

      console.log(userIsValid + " serial --" + index);
      if (userIsValid == "valid") {
        finalset.push(datajson[index]);

        fs.writeFileSync("valid_users.json", JSON.stringify(finalset));
      }
    }
  } catch (error) {
    console.log("Bot pause for 2 secounds at -" + serials);
    await browser.close();
    var startagain = serials + 1;
    await usersProfileDetails(startagain);
  }

  await browser.close();
};

var start = 0;
usersProfileDetails(start);
