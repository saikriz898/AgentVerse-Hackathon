const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.78, locale: 'en-GB' },
  INR: { symbol: '₹', rate: 83.5, locale: 'en-IN' },
};

export const formatCurrency = (amount, currency = 'USD') => {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = (amount || 0) * config.rate;

  return `${config.symbol}${Math.round(converted).toLocaleString(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatNumber = (num) => {
  return (num || 0).toLocaleString('en-US');
};

export const formatPercent = (val) => {
  return `${val >= 0 ? '+' : ''}${(val || 0).toFixed(1)}%`;
};

export const downloadCSV = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (filename, data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
