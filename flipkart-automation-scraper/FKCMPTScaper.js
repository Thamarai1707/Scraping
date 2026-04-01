const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const urls = [
        "https://www.flipkart.com/product/p/itme?pid=ACCGTVFZUZM8YGJX",
        "https://www.flipkart.com/product/p/itme?pid=ACCGTVFZUZM8YGJX",
        "https://www.flipkart.com/product/p/itme?pid=ACCFT76ZUFZFZFC4",
        "https://www.flipkart.com/product/p/itme?pid=ACCGRXPXRFPAH3UF",
        "https://www.flipkart.com/product/p/itme?pid=ACCGRXPXRFPAH3UF",
        "https://www.flipkart.com/product/p/itme?pid=ACCGNHJG2Y9HRZUY",
        "https://www.flipkart.com/product/p/itme?pid=ACCGX9T467KA9ECD",
        "https://www.flipkart.com/product/p/itme?pid=ACCFTAZKVW5JTWZ7",
        "https://www.flipkart.com/product/p/itme?pid=ACCGFX72DXBTMURM", 
        "https://www.flipkart.com/product/p/itme?pid=ACCGPN4HQTXTUKQZ",
        "https://www.flipkart.com/product/p/itme?pid=ACCGZ59GHKSFHZTR",
        "https://www.flipkart.com/product/p/itme?pid=ACCG7632H2KAMQAB"
        
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
