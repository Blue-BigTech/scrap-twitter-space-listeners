const puppeteer = require('puppeteer');
const chromePaths = require('chrome-paths');
const Chrome_Browser_PATH = chromePaths.chrome;
var fs = require("fs");


(async () => { /* const browser = await puppeteer.launch({
        //headless: false
    }); */

    const browser = await puppeteer.launch({
        executablePath: Chrome_Browser_PATH, headless: false,
        // userDataDir: path.resolve(__dirname, "./perfil"),
        args: [
            "--disable-infobars", "--no-sandbox", "--disable-blink-features=AutomationControlled", '--start-maximized'
        ],
        ignoreDefaultArgs: ["--enable-automation"]
    });
    console.log("running with headless mode");
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setViewport({width: 1920, height: 1008});

    await page.goto('https://twitter.com/i/flow/login', {
        waitUntil: 'load',
        timeout: 0
    });


    await page.waitForTimeout(300000)
    const NewcookiesFilePath = "twiter-cookies.json";
    // Save Session Cookies
    const cookiesObject = await page.cookies();
    // Write cookies to temp file to be used in other profile pages
    fs.writeFile(NewcookiesFilePath, JSON.stringify(cookiesObject), function (err) {
        if (err) {
            console.log("The file could not be written.", err);
        }
        console.log("Session has been successfully saved");
    });


    console.log("closed the browser");
    await browser.close();

})();
