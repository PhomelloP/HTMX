import express from 'express';

const app = express();

// Set static folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/get-price', async (req, res) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        const price = data.bitcoin.usd;
        res.send(`<div class="price-display success">$${price.toLocaleString()}</div>`);
    } catch (error) {
        console.error('Price fetch error:', error);
        res.send(`
            <div class="price-display error">
                Unable to fetch price
                <span class="error-details">🔄 Retrying...</span>
            </div>
        `);
    }
});

// Start the server
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});