const headerMessage = `
----------------------------------------------------
|     Twitter Space Listeners profile Scraper bot   |
----------------------------------------------------
`;

console.log(headerMessage);

const puppeteer = require('puppeteer-extra')
const chromePaths = require('chrome-paths');
const Chrome_Browser_PATH = chromePaths.chrome;
var fs = require("fs");
const _ = require('lodash');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var datafile = fs.readFileSync('./listenersList.json');
datafile = datafile.toString();
var datajson = JSON.parse(datafile);


var FileName = datajson[1].creatorName;

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
    var rs = [];
    page.on("request", async (request) => {
        if (request.url().includes("https://api.twitter.com/graphql/t")) {
            // console.log(request);
           
            try {
                var target_profile_url = await request._url;
                var crftoken = await request._headers;
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
                const profile_name = parsed.data.user.result.legacy.name;
                const username = parsed.data.user.result.legacy.screen_name;
                var attached_link = parsed.data.user.result.legacy.entities.url;
                if (attached_link) {
                    attached_link = attached_link.urls[0].expanded_url;
                }
                else {
                    attached_link = 'no data available';
                }
                const joindate = parsed.data.user.result.legacy.created_at;
                const location = parsed.data.user.result.legacy.location;
                const Tweets = parsed.data.user.result.legacy.statuses_count
                const followers = parsed.data.user.result.legacy.followers_count;
                const following = parsed.data.user.result.legacy.friends_count;
                var verified_blue_badge = parsed.data.user.result.is_blue_verified;

                if (verified_blue_badge) {
                    verified_blue_badge = 'yes';
                }
                else {
                    verified_blue_badge = 'no';
                }
                const favourites_count = parsed.data.user.result.legacy.favourites_count;
                const profile_image_url = parsed.data.user.result.legacy.profile_image_url_https;
                var profile_banner = parsed.data.user.result.legacy.profile_banner_url;

            if(profile_banner)
            {
            profile_banner =profile_banner;
            }
            else{
            profile_banner = 'no data available';
            }




                var professional_category = '';
                var professional_type = parsed.data.user.result.professional;
                if (professional_type) {

                    professional_category = parsed.data.user.result.professional.category[0];
                    if (professional_category) {
                        professional_category = professional_category.name;
                    }
                    else {
                        professional_category = 'no data available';
                    }

                    professional_type = parsed.data.user.result.professional.professional_type;
                }
                else {
                    professional_type = 'no data available';
                }










                const description = parsed.data.user.result.legacy.description;
                finalset.push({
                    profile_url: Profile_url,
                    profile_name: profile_name,
                    username: '@' + username,
                    joindate: joindate,
                    location: location,
                    Tweets: Tweets.toString(),
                    followers: followers.toString(),
                    following: following.toString(),
                    verified_blue_badge: verified_blue_badge,
                    favourites_count: favourites_count.toString(),
                    profile_image_url: profile_image_url,
                    profile_banner: profile_banner,
                    professional_category: professional_category,
                    professional_type: professional_type,
                    profile_attached_link: attached_link,
                    description: description

                });

            } catch (error) {
                console.log("no data found");
            }
        }//end if
    });

    await page.evaluateOnNewDocument(() => {

        Object.defineProperty(navigator, 'maxTouchPoints', {
            get() {
                "¯\_(ツ)_/¯";
                return 1;
            },
        });

        "✌(-‿-)✌";
        navigator.permissions.query = i => ({ then: f => f({ state: "prompt", onchange: null }) });

    });


    var serials = 0;

    try {
        for (let index = start; index < datajson.length; index++) {
            const element = datajson[index].profile_url;
            console.log(index + " -- users profiles scraped");
            serials = index;

            await page.goto(element, { waitUntil: 'load', timeout: 0 });


            await page.waitForSelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(3) > div > div > div > div > div.css-1dbjc4n.r-6gpygo.r-14gqq1x > div.css-1dbjc4n.r-1wbh5a2.r-dnmrzs.r-1ny4l3l > div > div.css-1dbjc4n.r-1wbh5a2.r-dnmrzs.r-1ny4l3l > div > div > span:nth-child(1) > span',{timeout:1500});

        }
    } catch (error) {
       
        console.log("Bot pause for 2 secounds at -" + serials);
        await browser.close();
        var startagain = serials + 1;
        await usersProfileDetails(startagain);

    }

    var datasheets = _.uniqBy(finalset, 'username');


    var header_name = [
        'profile_url',
        'profile_name',
        'username',
        'joindate',
        'location',
        'Tweets',
        'followers',
        'following',
        'verified_blue_badge',
        'favourites_count',
        'profile_image_url',
        'profile_banner',
        'professional_category',
        'professional_type',
        'attached_link',
        'description'];


    const xl = require('excel4node');
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    const headingColumnNames = header_name;
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });
    let rowIndex = 2;
    datasheets.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(record[columnName])
        });
        rowIndex++;
    });

    const filename = `result/${FileName}-space-Lisenters-data.xlsx`;
    wb.write(filename);

    await browser.close();


};

var start = 0;
usersProfileDetails(start);
