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
	const [fromCurrency, setFromCurrency] = useState('USD');
	const [toCurrency, setToCurrency] = useState('EUR');
	const [convertedAmount, setConvertedAmount] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);

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
	useEffect(() => {
		const fetchCurrenciesHistory = async () => {
			const today = new Date();
			const fiveYearsAgo = new Date();
			fiveYearsAgo.setFullYear(today.getFullYear() - 5);

			// Loop through the last 5 years, but only for January
			for (
				let year = fiveYearsAgo.getFullYear();
				year <= today.getFullYear();
				year++
			) {
				const startDate = new Date(year, 0, 1); // January 1st of the year
				const endDate = new Date(year, 0, 31); // January 31st of the year

				// Build the formatted date for January 1st
				const formattedDate = `${year}/01/01`;

				// Construct the API URL
				const apiUrl = `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_API}/history/${fromCurrency}/${formattedDate}/${amount}`;

				try {
					const response = await axios.get(apiUrl);
					console.log(
						`Data for ${fromCurrency} ${formattedDate}:`,
						response.data,
						response.data?.conversion_amounts,
						response.data?.year
					);
					// Optionally, you can process/store this data (e.g., setCurrencies or setData)
				} catch (err) {
					console.error(`Failed to fetch data for ${formattedDate}:`, err);
				}
			}
		};

		fetchCurrenciesHistory();
	}, []);

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

	const getCurrencyFlag = (currencyCode) => {
		return `https://flagcdn.com/w40/${currencyCode
			.substring(0, 2)
			.toLowerCase()}.png`;
	};

	const swapCurrencies = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
	};

	return (
		<div className="flex justify-center items-center min-h-screen p-5">
			<Card className="p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
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
										/>{' '}
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
					<div className="flex justify-end ">
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
										/>{' '}
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
		</div>
	);
};

export default CurrencyConverter;
