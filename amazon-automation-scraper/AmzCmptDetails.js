const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Amazon product URLs
const urls = [
    'https://www.amazon.in/dp/B09QKZNMVD',
    'https://www.amazon.in/dp/B09QKZNMVD',
    'https://www.amazon.in/dp/B0B1J8SXLC',
    'https://www.amazon.in/dp/B0B6465WX6',
    'https://www.amazon.in/dp/B0CZ3L7SSG',
    'https://www.amazon.in/dp/B0CZ3L7SSG',
    'https://www.amazon.in/dp/B0BTDNZQWJ',
    'https://www.amazon.in/dp/B0CBS4YLSC',
    'https://www.amazon.in/dp/B09RQR84CC',
    'https://www.amazon.in/dp/B0C89TD2GX',
    'https://www.amazon.in/dp/B0C36ZDJPV',
    'https://www.amazon.in/dp/B09QKZNMVD',
    'https://www.amazon.in/dp/B09RSWDDC6',
    'https://www.amazon.in/dp/B0D96LS6W6',
    'https://www.amazon.in/dp/B09RQR84CC',
    'https://www.amazon.in/dp/B09RQR84CC',
    'https://www.amazon.in/dp/B0B6465WX6',
    'https://www.amazon.in/dp/B0B6441RNK',
    'https://www.amazon.in/dp/B0B6441RNK',
    'https://www.amazon.in/dp/B0B1J8SXLC',
    'https://www.amazon.in/dp/B084685MT1',
];

const csvPath = path.join(__dirname, 'Amazon_Cmpt_Data.csv');
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
