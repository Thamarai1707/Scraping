const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const urls = [
   "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVHTX3MAHN",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVY5KQ6DER",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZDYBQRGZ36",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZZGUSGZ2K5",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZZZHHJZGC2",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGV3JZ3N6EB",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVZYZYFHXD",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGV4ENPNSXH",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZPZHHZQFAM",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZPSCA9WYFU",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZPQE7YFRGC",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZP9QZNUDAG",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVUJRBZWDN",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVRFGFGZZP",
    "https://www.flipkart.com/product/p/itme?pid=ACCGR7ZXDYPXMUGA",
    "https://www.flipkart.com/product/p/itme?pid=ACCGR7ZXNN2EBZNQ",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGV7QNYZWG2",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVTFNBCGSG",
    "https://www.flipkart.com/product/p/itme?pid=ACCGC92S8ZP3PRVH",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGVTVXMGZTR",
    "https://www.flipkart.com/product/p/itme?pid=ACCGR8YZ9EZEN3YJ",
    "https://www.flipkart.com/product/p/itme?pid=ACCGR8YZ29ZYMZAZ",
    "https://www.flipkart.com/product/p/itme?pid=ACCGYDNR6PFVMZGA",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBUTWYFGEZKBW",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBUTW6GB2J4EF",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBUTWRXG5DUNF",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSFSUGFGCU",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGS6ERNM7GG",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSQSRUJEAH",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSHVEBZZW7",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSNZDFDGKM",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZDG5GKHNWV",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSX5FUAY2J",
    "https://www.flipkart.com/product/p/itme?pid=ACCGC92SBJJ98WPQ",
    "https://www.flipkart.com/product/p/itme?pid=ACCGBWGSTZENH4HF",
    "https://www.flipkart.com/product/p/itme?pid=ACCGGWZPFUSFYBGU",
    "https://www.flipkart.com/product/p/itme?pid=ACCH6T8XT8G9SHDZ",
    "https://www.flipkart.com/product/p/itme?pid=ACCH6T8XJFKGK88T",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEYAPGEAYMBPX",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEX42EZG4BBYN",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEX42GZ2HMF27",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEX42AZXBENGF",
    "https://www.flipkart.com/product/p/itme?pid=ACCGQSGHFHAEVBAD",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEX42JYHYSX66",
    "https://www.flipkart.com/product/p/itme?pid=ACCH8J6XG4FHFKPC",
    "https://www.flipkart.com/product/p/itme?pid=ACCGSF5XP8HE928V",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZQSSZZ5ZHS",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZQKCBYGAGG",
    "https://www.flipkart.com/product/p/itme?pid=ACCHDTCCE8RQFFFR",
    "https://www.flipkart.com/product/p/itme?pid=ACCHDTCCNRJHTVRE",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZP7TF85AYH",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZPATZCEHHN",
    "https://www.flipkart.com/product/p/itme?pid=ACCGSF5SGHFKUMBE",
    "https://www.flipkart.com/product/p/itme?pid=ACCGSBUQ7JYVJTYA",
    "https://www.flipkart.com/product/p/itme?pid=ACCHF6QAYY83HFPH",
    "https://www.flipkart.com/product/p/itme?pid=ACCHF6QAPRFHVZRH",
    "https://www.flipkart.com/product/p/itme?pid=ACCHDTCCBUSTMNNV",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZPSP7ZEYDP",
    "https://www.flipkart.com/product/p/itme?pid=ACCGYQFFBUXHCC8T",
    "https://www.flipkart.com/product/p/itme?pid=ACCGHFZPTUUDKMG3",
    "https://www.flipkart.com/product/p/itme?pid=ACCGSBUQGBYZZYKR",
    "https://www.flipkart.com/product/p/itme?pid=ACCHYJZ9GG49TTUZ",
    "https://www.flipkart.com/product/p/itme?pid=ACCGWT53ZXHNEP6H",
    "https://www.flipkart.com/product/p/itme?pid=ACCGXVVM9UAHGAGS",
    "https://www.flipkart.com/product/p/itme?pid=ACCGZ6EBZ5CGGRV3",
    "https://www.flipkart.com/product/p/itme?pid=ACCHDG4HQAGB4WNK",
    "https://www.flipkart.com/product/p/itme?pid=ACCGYQFFPFXAP7CG",
    "https://www.flipkart.com/product/p/itme?pid=ACCHF6QAWPDTRZV6",
    "https://www.flipkart.com/product/p/itme?pid=ACCHEX429QBRFGZA",
    "https://www.flipkart.com/product/p/itme?pid=ACCGWT53GHPBWCXH",
    "https://www.flipkart.com/product/p/itme?pid=ACCHF6QA59WNWFBN",
    "https://www.flipkart.com/product/p/itme?pid=ACCHAHXHJH34Y6UZ",
    "https://www.flipkart.com/product/p/itme?pid=ACCHDTCCASYFJMSG",
    "https://www.flipkart.com/product/p/itme?pid=ACCHESY9ZXCXR4BB"
];

// Sleep helper (works with older Puppeteer)
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const csvFilePath = path.join(__dirname, 'FKGovo.csv');

    if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(
            csvFilePath,
            '\uFEFFWebsite,Product Name,Product Price,Rating Summary,Date,Time\n',
            { encoding: 'utf8' }
        );
    }

    const writer = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'website', title: 'Website' },
            { id: 'name', title: 'Product Name' },
            { id: 'price', title: 'Product Price' },
            { id: 'ratingSummary', title: 'Rating Summary' },
            { id: 'date', title: 'Date' },
            { id: 'time', title: 'Time' }
        ],
        append: true
    });

    let products = [];

    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await sleep(3000);

            const product = await page.evaluate(() => {
                const now = new Date();

                // ---------- Product Name ----------
                let name = 'N/A';
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle && ogTitle.getAttribute('content')) {
                    name = ogTitle.getAttribute('content').trim();
                } else {
                    const h1 = document.querySelector('h1');
                    if (h1) name = h1.innerText.trim();
                }

                // ---------- Price (JSON-LD FIRST) ----------
                let price = 'N/A';

                const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
                for (const script of jsonLdScripts) {
                    try {
                        const data = JSON.parse(script.innerText);
                        const items = Array.isArray(data) ? data : [data];

                        for (const item of items) {
                            if (item && item.offers && item.offers.price) {
                                const p = item.offers.price;
                                price = `₹${Number(p).toLocaleString('en-IN')}`;
                                break;
                            }
                        }
                    } catch (e) {}
                }

                // ---------- Rating Summary ----------
                let ratingSummary = 'N/A';
                let ratingValue = null;
                let ratingCount = null;

                for (const script of jsonLdScripts) {
                    try {
                        const data = JSON.parse(script.innerText);
                        const items = Array.isArray(data) ? data : [data];

                        for (const item of items) {
                            if (item && item.aggregateRating) {
                                if (item.aggregateRating.ratingValue) ratingValue = item.aggregateRating.ratingValue;
                                if (item.aggregateRating.ratingCount) ratingCount = item.aggregateRating.ratingCount;
                                else if (item.aggregateRating.reviewCount) ratingCount = item.aggregateRating.reviewCount;
                            }
                        }
                    } catch (e) {}
                }

                if (ratingValue && ratingCount) {
                    ratingSummary = `${ratingValue}★ and ${Number(ratingCount).toLocaleString('en-IN')} Ratings`;
                }

                // ---------- Date & Time ----------
                const d = now.getDate();
                const m = now.getMonth() + 1;
                const y = now.getFullYear();
                const date = `${d}-${m}-${y}`;
                const time = now.toTimeString().split(' ')[0];

                return {
                    website: 'Flipkart',
                    name,
                    price,
                    ratingSummary,
                    date,
                    time
                };
            });

            products.push(product);
            console.log(product);

        } catch (err) {
            console.error('Error scraping:', url, err.message);
        }
    }

    if (products.length > 0) {
        await writer.writeRecords(products);
        console.log('Data saved to FKGovo.csv');
    }

    await browser.close();
})();
