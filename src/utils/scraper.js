const puppeteer = require('puppeteer');
const _ = require('lodash');
const VIEWPORT = {width: 1200, height: 900};
const URL = 'https://www.wetter.de/';

const makeScreenshot = async () => {
    const browser = await puppeteer.launch({
        product: 'chrome',
        headless: false
    });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto(URL);
    await page.setViewport(VIEWPORT);

    try {
        await page.waitForSelector("iframe");
        const elementHandle = await page.$("#sp_message_iframe_634974");
        const iframe = await elementHandle.contentFrame();

        await iframe.$$eval('.sp_choice_type_11', elements => elements[0].click());

        await page.waitForSelector(".weather-report-teaser__map");
        const element = await page.$('.weather-report-teaser__map');

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        await element.screenshot({
            path: `${year}-${_.padStart(month, 2, '0')}-${_.padStart(day, 2, '0')}-${_.padStart(hours, 2, '0')}-${_.padStart(minutes, 2, '0')}-${_.padStart(seconds, 2, '0')}-wetter.png`});
    } catch (e) {
        console.log(e);
    }
    browser.close();
}
setInterval(() => { makeScreenshot(); }, 8000);
