import { useState, useCallback } from 'react';
import AddSymbolModal from './components/AddSymbolModal';

export interface StockItem {
  symbol: string;
  price: number;
  change: number;
  updatedAt: Date;
  addedAt: number;
}

const MAX_STOCKS = 30;
type SortType = 'LATEST' | 'SYMBOL' | 'PRICE_DESC';

function App() {
  const [watchlist, setWatchlist] = useState<StockItem[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('LATEST');
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockData = useCallback(async (symbolsToFetch: string[]) => {
    if (symbolsToFetch.length === 0) return;

    setIsLoading(true);
    const symbolsString = symbolsToFetch.join(',');

    const url = `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${symbolsString}&feed=iex`;

    try {
      const keyId = process.env.REACT_APP_ALPACA_KEY_ID;
      const secretKey = process.env.REACT_APP_ALPACA_SECRET_KEY;

      if (!keyId || !secretKey) {
        throw new Error('Missing Alpaca API environment variables');
      }

      const response = await fetch(url, {
        headers: {
          'APCA-API-KEY-ID': keyId,
          'APCA-API-SECRET-KEY': secretKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setWatchlist((prevWatchlist) => {
        return prevWatchlist.map((item) => {
          const stockData = data[item.symbol];
          if (stockData) {
            // Priority: Last Trade -> Daily Bar Close -> 0
            const currentPrice =
              stockData.latestTrade?.p || stockData.dailyBar?.c || 0;
            // Previous close for change calculation
            const prevClose = stockData.prevDailyBar?.c || currentPrice;

            let changePercent = 0;
            if (prevClose > 0) {
              changePercent = ((currentPrice - prevClose) / prevClose) * 100;
            }

            return {
              ...item,
              price: currentPrice,
              change: parseFloat(changePercent.toFixed(2)),
              updatedAt: new Date(),
            };
          }
          return item;
        });
      });
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddSymbol = (newSymbol: string) => {
    const isDuplicate = watchlist.some((item) => item.symbol === newSymbol);
    if (!isDuplicate) {
      const newStock: StockItem = {
        symbol: newSymbol,
        price: 0,
        change: 0,
        updatedAt: new Date(),
        addedAt: Date.now(),
      };

      setWatchlist((prev) => {
        const newList = [...prev, newStock];
        setTimeout(() => fetchStockData([newSymbol]), 100);
        return newList;
      });
      setSortType('LATEST');
    }
    setIsModalOpen(false);
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbolToRemove));
  };

  const handleRefresh = () => {
    const symbols = watchlist.map((item) => item.symbol);
    fetchStockData(symbols);
  };

  const getSortedWatchlist = () => {
    const items = [...watchlist];
    switch (sortType) {
      case 'SYMBOL':
        return items.sort((a, b) => a.symbol.localeCompare(b.symbol));
      case 'PRICE_DESC':
        return items.sort((a, b) => b.price - a.price);
      case 'LATEST':
      default:
        return items.sort((a, b) => b.addedAt - a.addedAt);
    }
  };

  const sortedWatchlist = getSortedWatchlist();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-5xl">
        <div className="bg-gray-50 p-8 pb-0">
          <div
            className="mb-8 flex flex-col items-center justify-between gap-6
              md:flex-row"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="mb-1 text-4xl font-extrabold">
                  US Stocks & ETFs Watchlist
                </h1>
                <p className="text-sm text-gray-400">
                  Updated using Alpaca Snapshot API
                </p>
              </div>
              <div
                className="flex flex-col gap-2 rounded-lg border-[1px]
                  border-b-lime-400 border-l-teal-400 border-r-lime-400
                  border-t-teal-400 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">
                    Tracking{' '}
                    <span className="font-bold text-gray-800">
                      {watchlist.length}
                    </span>
                    /{MAX_STOCKS} symbols
                  </p>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-xs text-teal-500
                      underline hover:text-teal-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="mr-1 h-3 w-3 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Refresh Data'
                    )}
                  </button>
                </div>

                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-gray-200
                    shadow-inner"
                >
                  <div
                    className={`h-full transition-all duration-700 ${
                      watchlist.length >= MAX_STOCKS
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-teal-400 to-lime-400'
                      }`}
                    style={{
                      width: `${(watchlist.length / MAX_STOCKS) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={watchlist.length >= MAX_STOCKS}
              type="button"
              className={`rounded-full px-8 py-4 text-lg font-bold shadow-lg
                transition-all hover:scale-105 hover:shadow-xl ${
                  watchlist.length >= MAX_STOCKS
                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                    : `cursor-pointer bg-gradient-to-r from-teal-200 to-lime-200
                      text-gray-800 hover:from-teal-300 hover:to-lime-300`
                }`}
            >
              {watchlist.length >= MAX_STOCKS ? 'Limit Reached' : '+ Add Stock'}
            </button>
          </div>

          <div
            className="mb-4 flex items-center justify-end gap-3 text-sm
              font-medium"
          >
            <span className="text-gray-500">Sort by:</span>
            {[
              { text: '🕒 Recent', type: 'LATEST' },
              { text: ' 🔤 A-Z', type: 'SYMBOL' },
              { text: '💰 Price', type: 'PRICE_DESC' },
            ].map((option) => (
              <button
                key={option.text}
                onClick={() => setSortType(option.type as SortType)}
                className={`rounded-lg px-4 py-2
                ${sortType === option.type ? 'bg-blue-100 font-bold' : 'bg-white'}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white
            shadow-xl"
        >
          {sortedWatchlist.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center p-16
                text-center text-gray-400"
            >
              <p>Add a symbol to start watching.</p>
            </div>
          ) : (
            <div>
              <div className="flex bg-gray-100">
                {['Symbol', 'Latest Price', 'Change', 'Updated'].map(
                  (title) => (
                    <div
                      key={title}
                      className="flex-1 px-6 py-4 text-left text-xs font-bold
                        uppercase tracking-wider text-gray-500"
                    >
                      {title}
                    </div>
                  ),
                )}
                <div
                  className="w-[120px] py-4 text-left text-xs font-bold
                    text-gray-500"
                />
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {sortedWatchlist.map((stock) => (
                  <div key={stock.symbol} className="flex hover:bg-gray-50">
                    <div
                      className="flex flex-1 items-center px-6 py-2 text-left
                        text-xs font-bold uppercase tracking-wider
                        text-gray-500"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-10 w-10 items-center justify-center
                            rounded-xl bg-blue-100 font-bold text-blue-800"
                        >
                          {stock.symbol[0]}
                        </div>
                        <div className="text-base font-bold text-gray-900">
                          {stock.symbol}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex flex-1 items-center px-6 py-2 text-left
                        text-xs font-medium uppercase tracking-wider
                        text-gray-500
                        ${stock.price > 0 ? 'text-gray-800' : 'text-gray-400'}`}
                    >
                      $
                      {stock.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className="flex flex-1 items-center px-6 py-2 text-left
                        text-xs font-medium uppercase tracking-wider
                        text-gray-500"
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2.5
                          py-0.5 text-xs font-medium
                          ${stock.change === 0 ? 'bg-gray-100 text-gray-600' : stock.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {stock.change > 0 ? '+' : ''}
                        {stock.change}%
                      </span>
                    </div>
                    <div
                      className="flex flex-1 items-center px-6 py-2 text-left
                        text-xs font-medium uppercase tracking-wider
                        text-gray-500"
                    >
                      {stock.price === 0
                        ? '-'
                        : stock.updatedAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                    </div>
                    <button
                      onClick={() => handleRemoveSymbol(stock.symbol)}
                      className="group/btn flex w-[120px] items-center
                        justify-end gap-2 rounded-full py-2 pr-4 text-red-500
                        transition-all hover:bg-red-50 hover:pr-5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className="max-w-0 overflow-hidden whitespace-nowrap
                          text-sm font-medium opacity-0 transition-all
                          duration-300 ease-in-out group-hover/btn:max-w-[80px]
                          group-hover/btn:opacity-100"
                      >
                        Remove
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <AddSymbolModal
            closeModal={() => setIsModalOpen(false)}
            onAddSymbol={handleAddSymbol}
            existingSymbols={watchlist.map((item) => item.symbol)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
