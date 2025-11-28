import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const URL =
  'https://paper-api.alpaca.markets/v2/assets?status=active&asset_class=us_equity';

async function fetchSymbols() {
  try {
    const res = await axios.get(URL, {
      headers: {
        'APCA-API-KEY-ID': process.env.REACT_APP_ALPACA_KEY_ID,
        'APCA-API-SECRET-KEY': process.env.REACT_APP_ALPACA_SECRET_KEY,
      },
    });

    const symbols = res.data.map((item) => item.symbol);

    const dir = './src/data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(`${dir}/symbols.json`, JSON.stringify(symbols, null, 2));
    console.log('Symbols saved to src/data/symbols.json');
  } catch (err) {
    console.error(
      'Error fetching stocks:',
      err.response && err.response.data ? err.response.data : err.message,
    );
  }
}

fetchSymbols();
