const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Amazon product URLs
const urls = [
'https://amazon.in/dp/B09P35Y9Q8',
'https://amazon.in/dp/B09P348V1P',
'https://amazon.in/dp/B0BCG3HN8C',
'https://amazon.in/dp/B0BCG5FH9M',
'https://amazon.in/dp/BBOCFZ7Z9H',
'https://amazon.in/dp/B0BQVQVZHJ',
'https://amazon.in/dp/B0BQVY767B',
'https://amazon.in/dp/B0BQVCWXC1',
'https://amazon.in/dp/B0BCG2XW1S',
'https://amazon.in/dp/B0BCG29CNY',
'https://amazon.in/dp/B0BCG41JJW',
'https://amazon.in/dp/B09P35224S',
'https://amazon.in/dp/B09P3GQ9TQ',
'https://amazon.in/dp/B09P31MBGH',
'https://amazon.in/dp/B0B2DXNJGJ',
'https://amazon.in/dp/B0B2DZZZ43',
'https://amazon.in/dp/B0B2DZ97JD',
'https://amazon.in/dp/B0B2DZZ4ZZ',
'https://amazon.in/dp/B09P37YKMS',
'https://amazon.in/dp/B09P32F8M5',
'https://amazon.in/dp/B0C6Y3GYGC',
'https://amazon.in/dp/B0C6Y28BHN',
'https://amazon.in/dp/B09P33L9ZR',
'https://amazon.in/dp/B09V196GQR',
'https://amazon.in/dp/B09P36YZN7',
'https://amazon.in/dp/B0C695T38L',
'https://amazon.in/dp/B0C697JRQX',
'https://amazon.in/dp/B0CCNQDYJN',
'https://amazon.in/dp/B0CCNMVQBK',
'https://amazon.in/dp/B0CCNNHMD3',
'https://amazon.in/dp/B0CTZXC932',
'https://amazon.in/dp/B09PRQGKH8',
'https://amazon.in/dp/B09PRQ8MNW',
'https://amazon.in/dp/B09PRQ8S8G',
'https://amazon.in/dp/B09P34XY7M',
'https://amazon.in/dp/B09P2Z8KWN',
'https://amazon.in/dp/B09P385YZC',
'https://amazon.in/dp/B09P2Z8P87',
'https://amazon.in/dp/B09P33VQVG',
'https://amazon.in/dp/B0BCG6L6FS',
'https://amazon.in/dp/B0BVW5D48T',
'https://amazon.in/dp/B0BVW2DLB3',
'https://amazon.in/dp/B09P3FZD31',
'https://amazon.in/dp/B0BCFZDXD8',
'https://amazon.in/dp/B09P32HN32',
'https://amazon.in/dp/B0BN8MW6VH',
'https://amazon.in/dp/B0DQCSXHBS',
'https://amazon.in/dp/B0DQCV22MV',
'https://amazon.in/dp/B0FS23NF1R',
'https://amazon.in/dp/B0FN7YGKP4',
'https://amazon.in/dp/B0FS23K9CY',
'https://amazon.in/dp/B0FS24589C',
'https://amazon.in/dp/B0CC9RR41T',
'https://amazon.in/dp/B0CCPCBW65',
'https://amazon.in/dp/B0DFHTFTQB',
'https://amazon.in/dp/B0FGQCPBG8',
'https://amazon.in/dp/B09YV3YQVB',
'https://amazon.in/dp/B09YV4PXDZ',
'https://amazon.in/dp/B0FFHCZPWC',
'https://amazon.in/dp/B0FGQFN7BS',
'https://amazon.in/dp/B0D4ZC3CTV',
'https://amazon.in/dp/B09YV463PY',
'https://amazon.in/dp/B09YV3VFWD',
'https://amazon.in/dp/B0D4ZCXS7V',
'https://amazon.in/dp/B0CXTFP755',
'https://amazon.in/dp/B09YV5LC7F',
'https://amazon.in/dp/B0CTZR934B',
'https://amazon.in/dp/B09YV2XRY7',
'https://amazon.in/dp/B0CF9NVXW5',
'https://amazon.in/dp/B0C2Z5SQN9',
'https://amazon.in/dp/B0D35QHJ1B',
'https://amazon.in/dp/B0D4ZFVSC1',
'https://amazon.in/dp/B0CXTCJ3PR',
'https://amazon.in/dp/B0D4ZD52G5',
'https://amazon.in/dp/B0CTZQ36XP',
'https://amazon.in/dp/B0G346RBXR',
'https://amazon.in/dp/B0FGQFF23Y',
'https://amazon.in/dp/B0CKYTNQB2',
'https://amazon.in/dp/B0G33H1C31',
'https://amazon.in/dp/B0F21W8WPY',
'https://amazon.in/dp/B0FGQCWWT9',
'https://amazon.in/dp/B0FFH1MFYR',
'https://amazon.in/dp/B0G33DX2WK',
];

const csvPath = path.join(__dirname, 'Amazon_Govo_Data.csv');
const writer = csvWriter({
    path: csvPath,
    header: [
        { id: 'website', title: 'Website' },
        { id: 'title', title: 'Title' },
        { id: 'price', title: 'Price' },
        { id: 'reviews', title: 'Reviews' },
        { id: 'ratings', title: 'Ratings' },        
        { id: 'rank', title: 'Best Sellers Rank' },
        { id: 'datetime', title: 'Date Time Now' }
    ],
    append: fs.existsSync(csvPath)
});

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Pretend to be a normal browser
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-IN,en;q=0.9'
    });

    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Wait for title (if it exists)
            await page.waitForSelector('#productTitle', { timeout: 15000 }).catch(() => {});

            const data = await page.evaluate(() => {
                const getText = (selector) =>
                    document.querySelector(selector)?.innerText.trim() || '';

                const cleanNumber = (text) => {
                    if (!text) return '';
                    // remove commas, then extract first digit sequence
                    const match = text.replace(/[,]/g, '').match(/\d+/);
                    return match ? match[0] : '';
                };

                const title = getText('#productTitle');

                const price =
                    getText('#tp_price_block_total_price_ww .a-offscreen') ||
                    getText('#corePrice_feature_div .a-offscreen') ||
                    getText('.a-price .a-offscreen');

                // Ratings: usually "4.2 out of 5"
                const ratingsRaw =
                    getText('span[data-hook="rating-out-of-text"]') ||
                    getText('#acrPopover .a-size-base') ||
                    getText('#acrPopover');

                const ratings = ratingsRaw; // keep as-is (text)

                // Reviews count: may appear as "(1,234)", "1,234 ratings", etc.
                const reviewsRaw =
                    getText('#acrCustomerReviewText') ||
                    getText('#acrCustomerReviewLink .a-size-base') ||
                    getText('#acrCustomerReviewLink');

                const reviews = cleanNumber(reviewsRaw); // numeric string only

                const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                const ranks = [];
                document.querySelectorAll('span').forEach(span => {
                    const text = span.innerText.trim();
                    if (text.includes('#') && text.toLowerCase().includes('in electronics')) {
                        ranks.push(text);
                    }
                });

                return {
                    website: 'Amazon',
                    title,
                    price,
                    ratings,
                    reviews,
                    rank: ranks.join(' | '),
                    datetime: now
                };
            });

            await writer.writeRecords([data]);
            console.log(`✅ Scraped and saved data from: ${url}`);
        } catch (error) {
            console.error(`❌ Failed to scrape ${url}: ${error.message}`);
            await writer.writeRecords([{
                website: 'Amazon',
                title: url,
                price: '',
                ratings: '',
                reviews: '',
                rank: '',
                datetime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            }]);
        }
    }

    await browser.close();
    console.log('✅ All data has been scraped and saved.');
})();
