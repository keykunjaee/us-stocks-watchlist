"use strict";
exports.__esModule = true;
var react_1 = require("react");
var symbols_json_1 = require("../data/symbols.json");
function AddSymbolModal(_a) {
    var closeModal = _a.closeModal, onAddSymbol = _a.onAddSymbol, existingSymbols = _a.existingSymbols;
    var _b = react_1.useState(''), symbol = _b[0], setSymbol = _b[1];
    var _c = react_1.useState([]), suggestions = _c[0], setSuggestions = _c[1];
    var _d = react_1.useState(false), showSuggestions = _d[0], setShowSuggestions = _d[1];
    var wrapperRef = react_1.useRef(null);
    var isRealStock = symbols_json_1["default"].includes(symbol);
    var isDuplicate = existingSymbols.includes(symbol);
    var isValidToAdd = isRealStock && !isDuplicate;
    var handleInputChange = function (e) {
        var userInput = e.target.value.toUpperCase();
        setSymbol(userInput);
        if (userInput.length > 0) {
            var filtered = symbols_json_1["default"].filter(function (stock) {
                return stock.startsWith(userInput);
            });
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
        }
        else {
            setShowSuggestions(false);
        }
    };
    var handleSelectSuggestion = function (selectedSymbol) {
        setSymbol(selectedSymbol);
        setShowSuggestions(false);
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (isValidToAdd) {
            onAddSymbol(symbol);
        }
    };
    react_1.useEffect(function () {
        function handleClickOutside(event) {
            if (wrapperRef.current &&
                !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, [wrapperRef]);
    return (react_1["default"].createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black\n        bg-opacity-60 backdrop-blur-sm transition-opacity" },
        react_1["default"].createElement("div", { className: "mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white\n          shadow-2xl" },
            react_1["default"].createElement("div", { className: "border-b border-gray-100 bg-gradient-to-r from-teal-200\n            to-lime-200 px-6 py-4" },
                react_1["default"].createElement("h3", { className: "text-xl font-bold text-gray-800" }, "Add New Symbol"),
                react_1["default"].createElement("p", { className: "text-sm text-gray-700 opacity-80" }, "Search and add to your watchlist")),
            react_1["default"].createElement("form", { className: "relative h-[350px] p-6", onSubmit: handleSubmit },
                react_1["default"].createElement("label", { htmlFor: "symbol", className: "mb-2 block text-sm font-medium text-gray-500" }, "Ticker Symbol"),
                react_1["default"].createElement("div", { className: "relative", ref: wrapperRef },
                    react_1["default"].createElement("input", { id: "symbol", type: "text", value: symbol, onChange: handleInputChange, onFocus: function () {
                            if (symbol)
                                setShowSuggestions(true);
                        }, placeholder: "e.g. PLTR, LTM, RTX", className: "w-full rounded-xl border px-4 py-3 text-lg font-medium\n                outline-none transition-all focus:ring-4 focus:ring-opacity-20\n                " + (isDuplicate
                            ? "border-orange-400 focus:border-orange-500\n                      focus:ring-orange-500"
                            : !symbol
                                ? "border-gray-200 focus:border-teal-400\n                        focus:ring-teal-400"
                                : isRealStock
                                    ? "border-green-400 focus:border-green-500\n                          focus:ring-green-500"
                                    : "border-red-300 focus:border-red-500\n                          focus:ring-red-500"), autoFocus: true, autoComplete: "off" }),
                    showSuggestions && suggestions.length > 0 && (react_1["default"].createElement("ul", { className: "absolute z-20 mt-2 max-h-48 w-full overflow-y-auto\n                  rounded-xl border border-gray-100 bg-white py-2 text-sm\n                  shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none" }, suggestions.map(function (suggestion) { return (react_1["default"].createElement("li", { key: suggestion, onClick: function () { return handleSelectSuggestion(suggestion); }, className: "cursor-pointer px-4 py-2.5 font-medium\n                      text-gray-700 transition-colors hover:bg-teal-50\n                      hover:text-teal-700" }, suggestion)); }))),
                    react_1["default"].createElement("div", { className: "absolute left-0 top-full mt-2 w-full text-sm" },
                        symbol && isDuplicate && (react_1["default"].createElement("div", { className: "flex animate-pulse items-center gap-2 font-medium\n                    text-orange-600" }, "\u26A0\uFE0F Already in list")),
                        symbol &&
                            !isRealStock &&
                            !isDuplicate &&
                            showSuggestions &&
                            suggestions.length === 0 && (react_1["default"].createElement("div", { className: "flex items-center gap-2 font-medium text-red-500" }, "\u274C Not found")))),
                react_1["default"].createElement("div", { className: "absolute bottom-6 left-6 right-6 flex justify-end gap-3\n              border-t border-gray-100 pt-4" },
                    react_1["default"].createElement("button", { onClick: closeModal, type: "button", className: "cursor-pointer rounded-lg bg-gray-100 px-5 py-2.5\n                font-medium text-gray-600 transition-colors hover:bg-gray-200" }, "Cancel"),
                    react_1["default"].createElement("button", { type: "submit", disabled: !isValidToAdd, className: "rounded-lg px-6 py-2.5 font-bold text-gray-800\n                shadow-sm transition-all " + (isValidToAdd
                            ? "transform bg-gradient-to-r from-teal-200 to-lime-200\n                      shadow-md hover:-translate-y-0.5 hover:from-teal-300\n                      hover:to-lime-300"
                            : 'cursor-not-allowed bg-gray-200 text-gray-400') }, "Add Symbol"))))));
}
exports["default"] = AddSymbolModal;
