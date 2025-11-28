"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var AddSymbolModal_1 = require("./components/AddSymbolModal");
var MAX_STOCKS = 30;
function App() {
    var _this = this;
    var _a = react_1.useState([]), watchlist = _a[0], setWatchlist = _a[1];
    var _b = react_1.useState(false), isModalOpen = _b[0], setIsModalOpen = _b[1];
    var _c = react_1.useState('LATEST'), sortType = _c[0], setSortType = _c[1];
    var _d = react_1.useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var fetchStockData = react_1.useCallback(function (symbolsToFetch) { return __awaiter(_this, void 0, void 0, function () {
        var symbolsString, url, keyId, secretKey, response, data_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (symbolsToFetch.length === 0)
                        return [2 /*return*/];
                    setIsLoading(true);
                    symbolsString = symbolsToFetch.join(',');
                    url = "https://data.alpaca.markets/v2/stocks/snapshots?symbols=" + symbolsString + "&feed=iex";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    keyId = process.env.REACT_APP_ALPACA_KEY_ID;
                    secretKey = process.env.REACT_APP_ALPACA_SECRET_KEY;
                    if (!keyId || !secretKey) {
                        throw new Error('Missing Alpaca API environment variables');
                    }
                    return [4 /*yield*/, fetch(url, {
                            headers: {
                                'APCA-API-KEY-ID': keyId,
                                'APCA-API-SECRET-KEY': secretKey
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_1 = _a.sent();
                    setWatchlist(function (prevWatchlist) {
                        return prevWatchlist.map(function (item) {
                            var _a, _b, _c;
                            var stockData = data_1[item.symbol];
                            if (stockData) {
                                // Priority: Last Trade -> Daily Bar Close -> 0
                                var currentPrice = ((_a = stockData.latestTrade) === null || _a === void 0 ? void 0 : _a.p) || ((_b = stockData.dailyBar) === null || _b === void 0 ? void 0 : _b.c) || 0;
                                // Previous close for change calculation
                                var prevClose = ((_c = stockData.prevDailyBar) === null || _c === void 0 ? void 0 : _c.c) || currentPrice;
                                var changePercent = 0;
                                if (prevClose > 0) {
                                    changePercent = ((currentPrice - prevClose) / prevClose) * 100;
                                }
                                return __assign(__assign({}, item), { price: currentPrice, change: parseFloat(changePercent.toFixed(2)), updatedAt: new Date() });
                            }
                            return item;
                        });
                    });
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching stocks:', error_1);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, []);
    var handleAddSymbol = function (newSymbol) {
        var isDuplicate = watchlist.some(function (item) { return item.symbol === newSymbol; });
        if (!isDuplicate) {
            var newStock_1 = {
                symbol: newSymbol,
                price: 0,
                change: 0,
                updatedAt: new Date(),
                addedAt: Date.now()
            };
            setWatchlist(function (prev) {
                var newList = __spreadArrays(prev, [newStock_1]);
                setTimeout(function () { return fetchStockData([newSymbol]); }, 100);
                return newList;
            });
            setSortType('LATEST');
        }
        setIsModalOpen(false);
    };
    var handleRemoveSymbol = function (symbolToRemove) {
        setWatchlist(watchlist.filter(function (item) { return item.symbol !== symbolToRemove; }));
    };
    var handleRefresh = function () {
        var symbols = watchlist.map(function (item) { return item.symbol; });
        fetchStockData(symbols);
    };
    var getSortedWatchlist = function () {
        var items = __spreadArrays(watchlist);
        switch (sortType) {
            case 'SYMBOL':
                return items.sort(function (a, b) { return a.symbol.localeCompare(b.symbol); });
            case 'PRICE_DESC':
                return items.sort(function (a, b) { return b.price - a.price; });
            case 'LATEST':
            default:
                return items.sort(function (a, b) { return b.addedAt - a.addedAt; });
        }
    };
    var sortedWatchlist = getSortedWatchlist();
    return (React.createElement("div", { className: "min-h-screen bg-gray-50 text-gray-800" },
        React.createElement("div", { className: "mx-auto max-w-5xl" },
            React.createElement("div", { className: "bg-gray-50 p-8 pb-0" },
                React.createElement("div", { className: "mb-8 flex flex-col items-center justify-between gap-6\n              md:flex-row" },
                    React.createElement("div", { className: "flex flex-col gap-4" },
                        React.createElement("div", null,
                            React.createElement("h1", { className: "mb-1 text-4xl font-extrabold" }, "US Stocks & ETFs Watchlist"),
                            React.createElement("p", { className: "text-sm text-gray-400" }, "Updated using Alpaca Snapshot API (near real-time)")),
                        React.createElement("div", { className: "flex flex-col gap-2 rounded-lg border-[1px]\n                  border-b-lime-400 border-l-teal-400 border-r-lime-400\n                  border-t-teal-400 p-3" },
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("p", { className: "text-gray-500" },
                                    "Tracking",
                                    ' ',
                                    React.createElement("span", { className: "font-bold text-gray-800" }, watchlist.length),
                                    "/",
                                    MAX_STOCKS,
                                    " symbols"),
                                React.createElement("button", { onClick: handleRefresh, disabled: isLoading, className: "flex items-center gap-1 text-xs text-teal-500\n                      underline hover:text-teal-600 disabled:opacity-50" }, isLoading ? (React.createElement(React.Fragment, null,
                                    React.createElement("svg", { className: "mr-1 h-3 w-3 animate-spin", viewBox: "0 0 24 24" },
                                        React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                                        React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })),
                                    "Updating...")) : ('Refresh Data'))),
                            React.createElement("div", { className: "h-3 w-full overflow-hidden rounded-full bg-gray-200\n                    shadow-inner" },
                                React.createElement("div", { className: "h-full transition-all duration-700 " + (watchlist.length >= MAX_STOCKS
                                        ? 'bg-red-500'
                                        : 'bg-gradient-to-r from-teal-400 to-lime-400'), style: {
                                        width: (watchlist.length / MAX_STOCKS) * 100 + "%"
                                    } })))),
                    React.createElement("button", { onClick: function () { return setIsModalOpen(true); }, disabled: watchlist.length >= MAX_STOCKS, type: "button", className: "rounded-full px-8 py-4 text-lg font-bold shadow-lg\n                transition-all hover:scale-105 hover:shadow-xl " + (watchlist.length >= MAX_STOCKS
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : "cursor-pointer bg-gradient-to-r from-teal-200 to-lime-200\n                      text-gray-800 hover:from-teal-300 hover:to-lime-300") }, watchlist.length >= MAX_STOCKS ? 'Limit Reached' : '+ Add Stock')),
                React.createElement("div", { className: "mb-4 flex items-center justify-end gap-3 text-sm\n              font-medium" },
                    React.createElement("span", { className: "text-gray-500" }, "Sort by:"),
                    [
                        { text: '🕒 Recent', type: 'LATEST' },
                        { text: ' 🔤 A-Z', type: 'SYMBOL' },
                        { text: '💰 Price', type: 'PRICE_DESC' },
                    ].map(function (option) { return (React.createElement("button", { key: option.text, onClick: function () { return setSortType(option.type); }, className: "rounded-lg px-4 py-2\n                " + (sortType === option.type ? 'bg-blue-100 font-bold' : 'bg-white') }, option.text)); }))),
            React.createElement("div", { className: "overflow-hidden rounded-2xl border border-gray-100 bg-white\n            shadow-xl" }, sortedWatchlist.length === 0 ? (React.createElement("div", { className: "flex flex-col items-center justify-center p-16\n                text-center text-gray-400" },
                React.createElement("p", null, "Add a symbol to start watching."))) : (React.createElement("div", null,
                React.createElement("div", { className: "flex bg-gray-100" },
                    ['Symbol', 'Latest Price', 'Change', 'Updated'].map(function (title) { return (React.createElement("div", { key: title, className: "flex-1 px-6 py-4 text-left text-xs font-bold\n                        uppercase tracking-wider text-gray-500" }, title)); }),
                    React.createElement("div", { className: "w-[120px] py-4 text-left text-xs font-bold\n                    text-gray-500" })),
                React.createElement("div", { className: "divide-y divide-gray-100 bg-white" }, sortedWatchlist.map(function (stock) { return (React.createElement("div", { key: stock.symbol, className: "flex hover:bg-gray-50" },
                    React.createElement("div", { className: "flex flex-1 items-center px-6 py-2 text-left\n                        text-xs font-bold uppercase tracking-wider\n                        text-gray-500" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("div", { className: "flex h-10 w-10 items-center justify-center\n                            rounded-xl bg-blue-100 font-bold text-blue-800" }, stock.symbol[0]),
                            React.createElement("div", { className: "text-base font-bold text-gray-900" }, stock.symbol))),
                    React.createElement("div", { className: "flex flex-1 items-center px-6 py-2 text-left\n                        text-xs font-medium uppercase tracking-wider\n                        text-gray-500\n                        " + (stock.price > 0 ? 'text-gray-800' : 'text-gray-400') },
                        "$",
                        stock.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })),
                    React.createElement("div", { className: "flex flex-1 items-center px-6 py-2 text-left\n                        text-xs font-medium uppercase tracking-wider\n                        text-gray-500" },
                        React.createElement("span", { className: "inline-flex items-center rounded-full px-2.5\n                          py-0.5 text-xs font-medium\n                          " + (stock.change === 0 ? 'bg-gray-100 text-gray-600' : stock.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') },
                            stock.change > 0 ? '+' : '',
                            stock.change,
                            "%")),
                    React.createElement("div", { className: "flex flex-1 items-center px-6 py-2 text-left\n                        text-xs font-medium uppercase tracking-wider\n                        text-gray-500" }, stock.price === 0
                        ? '-'
                        : stock.updatedAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })),
                    React.createElement("button", { onClick: function () { return handleRemoveSymbol(stock.symbol); }, className: "group/btn flex w-[120px] items-center\n                        justify-end gap-2 rounded-full py-2 pr-4 text-red-500\n                        transition-all hover:bg-red-50 hover:pr-5" },
                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0", viewBox: "0 0 20 20", fill: "currentColor" },
                            React.createElement("path", { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z", clipRule: "evenodd" })),
                        React.createElement("span", { className: "max-w-0 overflow-hidden whitespace-nowrap\n                          text-sm font-medium opacity-0 transition-all\n                          duration-300 ease-in-out group-hover/btn:max-w-[80px]\n                          group-hover/btn:opacity-100" }, "Remove")))); }))))),
            isModalOpen && (React.createElement(AddSymbolModal_1["default"], { closeModal: function () { return setIsModalOpen(false); }, onAddSymbol: handleAddSymbol, existingSymbols: watchlist.map(function (item) { return item.symbol; }) })))));
}
exports["default"] = App;
