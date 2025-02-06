'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { LineCharts } from './LineChart';

const favoriteCurrencies = [
	{ code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: 'DKK' },
	{ code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: 'PKK' },
	{ code: 'USD', symbol: '$', name: 'US Dollar', flag: 'USD' },
	{ code: 'EUR', symbol: '€', name: 'Euro', flag: 'EUR' },
	{ code: 'GBP', symbol: '£', name: 'British Pound', flag: 'GBP' },
	{ code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'INR' },
];

const CurrencyConverter = () => {
	const [currencies, setCurrencies] = useState([]);
	const [amount, setAmount] = useState(1);
	const [fromCurrency, setFromCurrency] = useState('');
	const [toCurrency, setToCurrency] = useState('');
	const [convertedAmount, setConvertedAmount] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);
	const [currenciesHistory, setCurrenciesHistory] = useState([]);
	const [isHistoryLoaded, setIsHistoryLoaded] = useState(false); // Track if history data is fully loaded

	// Load saved currency preferences from localStorage
	useEffect(() => {
		const savedFromCurrency = localStorage.getItem('fromCurrency');
		const savedToCurrency = localStorage.getItem('toCurrency');

		if (savedFromCurrency) setFromCurrency(savedFromCurrency);
		if (savedToCurrency) setToCurrency(savedToCurrency);
	}, []);

	// Save selected currencies to localStorage
	useEffect(() => {
		localStorage.setItem('fromCurrency', fromCurrency);
		localStorage.setItem('toCurrency', toCurrency);
	}, [fromCurrency, toCurrency]);

	// Fetch available currencies
	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const response = await axios.get(
					`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_API}/latest/USD`
				);
				setCurrencies(Object.keys(response.data.conversion_rates));
			} catch (err) {
				console.error('Failed to fetch currency data.');
			}
		};
		fetchCurrencies();
	}, []);

	// Fetch historical currency data for the last 5 years
	useEffect(() => {
		const fetchCurrenciesHistory = async () => {
			const today = new Date();
			const fiveYearsAgo = new Date();
			fiveYearsAgo.setFullYear(today.getFullYear() - 5);
			const currencyHistory = [];

			// Loop through the last 5 years, but only for January
			for (
				let year = fiveYearsAgo.getFullYear();
				year <= today.getFullYear();
				year++
			) {
				const formattedDate = `${year}/01/01`;
				const apiUrl = `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_API}/history/${fromCurrency}/${formattedDate}/${amount}`;

				try {
					const response = await axios.get(apiUrl);
					const conversionRates = response.data?.conversion_amounts;
					const yearData = {
						name: year.toString(),
						[toCurrency]: conversionRates[toCurrency] || 0,
					};
					currencyHistory.push(yearData);

					// If all data for the 5 years is fetched, update state
					if (
						currencyHistory.length ===
						today.getFullYear() - fiveYearsAgo.getFullYear() + 1
					) {
						setCurrenciesHistory(currencyHistory);
						setIsHistoryLoaded(true);
					}
				} catch (err) {
					console.error(`Failed to fetch data for ${formattedDate}:`, err);
				}
			}
		};

		if (fromCurrency && toCurrency) {
			fetchCurrenciesHistory();
		}
	}, [fromCurrency, toCurrency, amount]); // Re-fetch when the selected currencies or amount change

	// Fetch exchange rate for conversion
	useEffect(() => {
		const fetchExchangeRate = async () => {
			try {
				const response = await axios.get(
					`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_API}/latest/${fromCurrency}`
				);
				const rate = response.data.conversion_rates[toCurrency];
				setExchangeRate(rate);
				setConvertedAmount((amount * rate).toFixed(2));
			} catch (err) {
				console.error('Failed to fetch exchange rate.');
			}
		};

		if (fromCurrency && toCurrency) {
			fetchExchangeRate();
		}
	}, [fromCurrency, toCurrency, amount]);

	// Function to get currency flags
	const getCurrencyFlag = (currencyCode) => {
		return `https://flagcdn.com/w40/${currencyCode
			.substring(0, 2)
			.toLowerCase()}.png`;
	};

	// Function to swap currencies
	const swapCurrencies = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
	};

	return (
		<div className="w-full mt-5">
			<Card className="m-auto p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
				<h1 className="text-xl font-bold text-center mb-4">
					Currency Converter
				</h1>

				<div className="space-y-4">
					{/* Amount Input */}
					<div>
						<Label className="text-sm">Amount</Label>
						<Input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
							className="mt-1"
						/>
					</div>

					{/* From Currency Selector */}
					<div>
						<Label className="text-sm">From</Label>
						<Select value={fromCurrency} onValueChange={setFromCurrency}>
							<SelectTrigger className="mt-1">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								{favoriteCurrencies.map(({ code, symbol, name, flag }) => (
									<SelectItem key={code} value={code}>
										<img
											src={getCurrencyFlag(flag)}
											alt={flag}
											className="w-5 h-5 inline-block mr-2"
										/>
										{name} ({symbol})
									</SelectItem>
								))}
								<hr className="my-1 border-gray-500" />
								{currencies
									.filter(
										(currency) =>
											!favoriteCurrencies.some((fav) => fav.code === currency)
									)
									.map((currency) => (
										<SelectItem key={currency} value={currency}>
											<img
												src={getCurrencyFlag(currency)}
												alt={currency}
												className="w-5 h-5 inline-block mr-2"
											/>
											{currency}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Swap Button */}
					<div className="flex justify-end">
						<Button
							variant="outline"
							onClick={swapCurrencies}
							className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center -mb-7"
						>
							<RefreshCcw className="w-5 h-5 mr-2" /> Swap
						</Button>
					</div>

					{/* To Currency Selector */}
					<div>
						<Label className="text-sm">To</Label>
						<Select value={toCurrency} onValueChange={setToCurrency}>
							<SelectTrigger className="mt-1">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								{favoriteCurrencies.map(({ code, symbol, name, flag }) => (
									<SelectItem key={code} value={code}>
										<img
											src={getCurrencyFlag(flag)}
											alt={flag}
											className="w-5 h-5 inline-block mr-2"
										/>
										{name} ({symbol})
									</SelectItem>
								))}
								<hr className="my-1 border-gray-500" />
								{currencies
									.filter(
										(currency) =>
											!favoriteCurrencies.some((fav) => fav.code === currency)
									)
									.map((currency) => (
										<SelectItem key={currency} value={currency}>
											<img
												src={getCurrencyFlag(currency)}
												alt={currency}
												className="w-5 h-5 inline-block mr-2"
											/>
											{currency}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Converted Amount */}
					{convertedAmount !== null && (
						<p className="text-3xl font-bold text-center">
							{amount} {fromCurrency} = {convertedAmount} {toCurrency}
						</p>
					)}
				</div>
			</Card>

			{isHistoryLoaded && <LineCharts currenciesHistory={currenciesHistory} />}
		</div>
	);
};

export default CurrencyConverter;
