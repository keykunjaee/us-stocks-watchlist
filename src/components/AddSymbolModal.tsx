import React, { useState, useEffect, useRef } from 'react';
import symbolsData from '../data/symbols.json';

interface AddSymbolModalProps {
  closeModal: () => void;
  onAddSymbol: (symbol: string) => void;
  existingSymbols: string[];
}

function AddSymbolModal({
  closeModal,
  onAddSymbol,
  existingSymbols,
}: AddSymbolModalProps) {
  const [symbol, setSymbol] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isRealStock = symbolsData.includes(symbol);
  const isDuplicate = existingSymbols.includes(symbol);
  const isValidToAdd = isRealStock && !isDuplicate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.toUpperCase();
    setSymbol(userInput);

    if (userInput.length > 0) {
      const filtered = symbolsData.filter((stock) =>
        stock.startsWith(userInput),
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidToAdd) {
      onAddSymbol(symbol);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black
        bg-opacity-60 backdrop-blur-sm transition-opacity"
    >
      <div
        className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white
          shadow-2xl"
      >
        <div
          className="border-b border-gray-100 bg-gradient-to-r from-teal-200
            to-lime-200 px-6 py-4"
        >
          <h3 className="text-xl font-bold text-gray-800">Add New Symbol</h3>
          <p className="text-sm text-gray-700 opacity-80">
            Search and add to your watchlist
          </p>
        </div>

        <form className="relative h-[350px] p-6" onSubmit={handleSubmit}>
          <label
            htmlFor="symbol"
            className="mb-2 block text-sm font-medium text-gray-500"
          >
            Ticker Symbol
          </label>

          <div className="relative" ref={wrapperRef}>
            <input
              id="symbol"
              type="text"
              value={symbol}
              onChange={handleInputChange}
              onFocus={() => {
                if (symbol) setShowSuggestions(true);
              }}
              placeholder="e.g. PLTR, LTM, RTX"
              className={`w-full rounded-xl border px-4 py-3 text-lg font-medium
                outline-none transition-all focus:ring-4 focus:ring-opacity-20
                ${
                  isDuplicate
                    ? `border-orange-400 focus:border-orange-500
                      focus:ring-orange-500`
                    : !symbol
                      ? `border-gray-200 focus:border-teal-400
                        focus:ring-teal-400`
                      : isRealStock
                        ? `border-green-400 focus:border-green-500
                          focus:ring-green-500`
                        : `border-red-300 focus:border-red-500
                          focus:ring-red-500`
                }`}
              autoFocus
              autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto
                  rounded-xl border border-gray-100 bg-white py-2 text-sm
                  shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="cursor-pointer px-4 py-2.5 font-medium
                      text-gray-700 transition-colors hover:bg-teal-50
                      hover:text-teal-700"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}

            <div className="absolute left-0 top-full mt-2 w-full text-sm">
              {symbol && isDuplicate && (
                <div
                  className="flex animate-pulse items-center gap-2 font-medium
                    text-orange-600"
                >
                  ⚠️ Already in list
                </div>
              )}
              {symbol &&
                !isRealStock &&
                !isDuplicate &&
                showSuggestions &&
                suggestions.length === 0 && (
                  <div
                    className="flex items-center gap-2 font-medium text-red-500"
                  >
                    ❌ Not found
                  </div>
                )}
            </div>
          </div>

          <div
            className="absolute bottom-6 left-6 right-6 flex justify-end gap-3
              border-t border-gray-100 pt-4"
          >
            <button
              onClick={closeModal}
              type="button"
              className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2.5
                font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidToAdd}
              className={`rounded-lg px-6 py-2.5 font-bold text-gray-800
                shadow-sm transition-all ${
                  isValidToAdd
                    ? `transform bg-gradient-to-r from-teal-200 to-lime-200
                      shadow-md hover:-translate-y-0.5 hover:from-teal-300
                      hover:to-lime-300`
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
            >
              Add Symbol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSymbolModal;
