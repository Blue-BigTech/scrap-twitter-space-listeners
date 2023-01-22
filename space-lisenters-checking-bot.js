const headerMessage = `
----------------------------------------------------
|       Twitter Space Listeners checking bot          |
----------------------------------------------------

`;

console.log(headerMessage);

console.log("Listeners profile Scraper bot");
console.log("Start checking...");
const puppeteer = require('puppeteer');
const chromePaths = require('chrome-paths');
const Chrome_Browser_PATH = chromePaths.chrome;
var fs = require("fs");
const _ = require('lodash');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


var filenamejson = fs.readFileSync('targetedFile.txt');
var filenamejsoN = filenamejson.toString();

var datafile = fs.readFileSync(filenamejsoN);
datafile = datafile.toString();
var datajson = JSON.parse(datafile);


var FileName = 'valid';

var finalset = [];
const usersProfileDetails = async (start) => {
    const browser = await puppeteer.launch({
        executablePath: Chrome_Browser_PATH,
        headless: true,
        args: [
            "--disable-infobars",
            "--no-sandbox",
            "--disable-blink-features=AutomationControlled", '--start-maximized'
        ],
        ignoreDefaultArgs: ["--enable-automation"],
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1920, height: 1008 });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() === 'image') {
            req.abort();
        }
        else {
            req.continue();
        }

    });

    var rs = [];
    page.on("request", async (request) => {
        if (request.url().includes("/UserTweets?variables")) {
            // console.log(request);

            try {
                var target_profile_url = request.url();
                var crftoken = request.headers();
                rs.push(crftoken);
                var Profile_url = await page.evaluate(() => {
                    return window.location.href;
                });

                var crf = await page.evaluate(() => {
                    var data = document.cookie;
                    data = data.split(";");
                    return data;

                });

                var a1 = [];
                var a2 = [];
                a1.push(rs[0]);
                a2.push(rs[1]);
                var hd = [...a1, ...a2];


                var headerString = JSON.stringify(hd);


                headerString = headerString.replace("},{", ",");

                var headerStringor = headerString.replace(`origin`, "'origin'");

                var headerStringr = headerStringor.replace('referer', "'referer'");
                var headerStringas = headerStringr.replace('accept', "'accept'");
                headerStringas = headerStringas.replace(`[`, '');
                headerStringas = headerStringas.replace(`]`, '');

                var hdr = JSON.parse(headerStringas);

                var parsed = await fetch(target_profile_url, {
                    "headers": hdr
                }).then(response => response.json()).then(data => { return data })

                var lenthOf_post = parsed.data.user.result.timeline_v2.timeline.instructions[1].entries;

                var jsondata = JSON.stringify(lenthOf_post);
                jsondata = jsondata.toLowerCase();

                var c3 = 'no';
                var c4 = 'no';


                if (jsondata.includes('https://twitter.com/ryancarson/status/')) {
                    c3 = 'yes';
                }

                if (jsondata.includes('ryancarson/status')) {

                    c4 = 'yes';
                }
                if (c3 == 'yes' || c4 == 'yes') {


                    var getcurrentUserInfo = datajson.find(item => item.profile_url == Profile_url);

                    finalset.push(getcurrentUserInfo)
                    //console.log(finalset);
                    console.log(finalset.length + ' -- valid listeners found');
                    fs.writeFileSync('valid_listenersList.json', JSON.stringify(finalset));
                }
            } catch (error) {

                // console.log(error);
                // console.log("no data found");
            }
        }//end if
    });














    var serials = 0;

    try {
        for (let index = start; index < datajson.length; index++) {
            const element = datajson[index].profile_url;
            //console.log(index + " -- Listeners profiles scraped");
            serials = index;

            await page.goto(element, { waitUntil: 'domcontentloaded', timeout: 0 });

            await page.evaluate(() => {

            });

            await page.waitForSelector('[data-testid="UserName"]', { timeout: 10000 });





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
