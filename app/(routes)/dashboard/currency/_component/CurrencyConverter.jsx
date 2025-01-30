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
import axios from 'axios';

const CurrencyConverter = () => {
	const [currencies, setCurrencies] = useState([]);
	const [amount, setAmount] = useState(1);
	const [fromCurrency, setFromCurrency] = useState('USD');
	const [toCurrency, setToCurrency] = useState('EUR');
	const [convertedAmount, setConvertedAmount] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);
	const [error, setError] = useState(null);
	const [showExchangeRate, setShowExchangeRate] = useState(false); // Toggle input or exchange rate

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const response = await axios.get(
					`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_API}/latest/USD`
				);
				setCurrencies(Object.keys(response.data.conversion_rates));
			} catch (err) {
				setError('Failed to fetch currency data.');
			}
		};
		fetchCurrencies();
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
				setError('Failed to fetch exchange rate.');
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

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-5">
			<Card className="p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg w-full max-w-md">
				<h1 className="text-xl font-bold text-center mb-4">
					Currency Converter
				</h1>

				{/* Toggle Button */}
				<div className="flex justify-center mb-4">
					<Button
						variant="outline"
						onClick={() => setShowExchangeRate(!showExchangeRate)}
						className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
					>
						{showExchangeRate ? 'Switch to Input' : 'Show Exchange Rate'}
					</Button>
				</div>

				<div className="space-y-4">
					{/* Amount Input or Exchange Rate */}
					<div>
						<Label className="text-sm">Amount</Label>
						{showExchangeRate ? (
							<p className="text-lg text-center font-semibold">
								1 {fromCurrency} = {exchangeRate} {toCurrency}
							</p>
						) : (
							<Input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="Enter amount"
								className="mt-1"
							/>
						)}
					</div>

					{/* From Currency Selector with Flag */}
					<div>
						<Label className="text-sm">From</Label>
						<Select value={fromCurrency} onValueChange={setFromCurrency}>
							<SelectTrigger className="mt-1 flex items-center">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								{currencies.map((currency) => (
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

					{/* To Currency Selector with Flag */}
					<div>
						<Label className="text-sm">To</Label>
						<Select value={toCurrency} onValueChange={setToCurrency}>
							<SelectTrigger className="mt-1 flex items-center">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								{currencies.map((currency) => (
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
					{convertedAmount !== null && !showExchangeRate && (
						<p className="text-lg font-semibold text-center">
							{amount} {fromCurrency} = {convertedAmount} {toCurrency}
						</p>
					)}

					{/* Error Message */}
					{error && <p className="text-red-500 text-center">{error}</p>}
				</div>
			</Card>
		</div>
	);
};

export default CurrencyConverter;
