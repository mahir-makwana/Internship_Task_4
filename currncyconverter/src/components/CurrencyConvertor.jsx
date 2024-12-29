import React, { useEffect, useState } from "react";
import CurrencyDropdown from "./CurrencyDropdown";
import { IoSwapHorizontal } from "react-icons/io5";

const CurrencyConvertor = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);

  const fetchAPI = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();

      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Something wrong", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencyConvert = async () => {
    if (!amount) {
      return;
    }
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.error("Something wrong", error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="mb-5 text-2xl font-semibold text-blue-800">
        Currency Convertor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdown
          currencies={currencies}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />

        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-blue-200 rounded-full cursor-pointer hover:bg-blue-300"
          >
            <IoSwapHorizontal className="text-xl text-blue-700" />
          </button>
        </div>

        <CurrencyDropdown
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title="To:"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-blue-800"
        >
          Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          className={`px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${converting ? "animate-pulse" : ""}`}
          onClick={currencyConvert}
        >
          Convert
        </button>
      </div>

      <div className="mt-4 text-lg font-medium text-right text-blue-600">
        Converted Amount: {convertedAmount}
      </div>
    </div>
  );
};

export default CurrencyConvertor;
