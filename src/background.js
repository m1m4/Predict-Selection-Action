import googleCurrencyScraper, { CurrencyCode } from "google-currency-scraper";

const TOP_25_CURRENCIES = [
  CurrencyCode.USD,
  CurrencyCode.EUR,
  CurrencyCode.GBP,
  CurrencyCode.JPY,
  CurrencyCode.CAD,
  CurrencyCode.AUD,
  CurrencyCode.CHF,
  CurrencyCode.HKD,
  CurrencyCode.NZD,
  CurrencyCode.SEK,
  CurrencyCode.KRW,
  CurrencyCode.SGD,
  CurrencyCode.NOK,
  CurrencyCode.MXN,
  CurrencyCode.INR,
  CurrencyCode.ILS,
  CurrencyCode.ZAR,
  CurrencyCode.TRY,
  CurrencyCode.BRL,
  CurrencyCode.TWD,
  CurrencyCode.DKK,
  CurrencyCode.PLN,
  CurrencyCode.THB,
  CurrencyCode.IDR,
  CurrencyCode.HUF,
];

/**
 * Attempts to fetch the user's currency based on their IP address using the ipapi.co service.
 * If the fetch is successful, it returns the user's currency code. If the fetch fails or no
 * currency code is found, it defaults to "USD".
 *
 * @returns {Promise<string>} The user's currency code, or "USD" if it cannot be determined.
 */
// TODO: find currency based on country name if currency variable is not available.
async function findUserCurrency() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const userCurrency = data.currency ? data.currency : "USD"; // Default to USD if no country found
    return userCurrency;
  } catch (error) {
    console.error("Error fetching user currency:", error);
    return "USD"; // Default to USD if an error occurs
  }
}

/**
 * Fetches the latest exchange rates for the top 25 currencies and stores them in the browser's local storage.
 *
 * @param {string} target_currency - The currency code of the target currency to fetch rates for.
 * @returns {Promise<{ rates: { [key: string]: [number, number] } }>} - An object containing the fetched exchange rates with
 *  the first number being the rate and the second is date in miliseconds.
 */
async function updateRates(target_currency) {
  let rates = {};
  for (const currency of TOP_25_CURRENCIES) {
    if (target_currency == currency) {
      continue;
    }

    const rate = await googleCurrencyScraper({
      from: currency,
      to: target_currency,
    });
    rates[currency] = [
      rate.rate,
      Date.parse(rate.dateUpdated + new Date().getFullYear()),
    ];
  }

  await browser.storage.local.set({
    rates: rates,
  });

  return { rates: rates };
}

/**
 * Handles a message request by fetching the latest exchange rates from the browser's local storage and returning the rate for the first currency in the request.
 *
 * @param {Object} request - The message request object, which should contain a `currencies` property with an array of currency codes.
 * @returns {Promise<number>} - The exchange rate for the first currency in the `currencies` array.
 */
async function handleMessage(request) {
  let rates = await browser.storage.local.get("rates");
  rates = rates.rates;

  if (!rates) {
    console.log("Waiting for rates to be fetched");
  }
  // Wait until rates are available
  while (!rates) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    rates = await browser.storage.local.get("rates");
    rates = rates.rates;
  }

  // TODO: add support for all the currencies selected, instead of the first one
  return rates[request.currencies[0]][0];
}


async function startup() {
  // Check if the user has set a default currency
  // TODO: send default currency to content script
  let defaultCurrency = await browser.storage.local.get("default_currency");
  if (Object.keys(defaultCurrency).length == 0) {
    console.log("No default currency found, setting default currency");
    defaultCurrency = await findUserCurrency();
    await browser.storage.local.set({ default_currency: defaultCurrency });
    console.log("Default currency was set to " + defaultCurrency);
  } else {
    console.log("Default Currency found!");
    defaultCurrency = defaultCurrency.default_currency;
  }

  // Check if the user has rates for the default currency
  let rates = await browser.storage.local.get("rates");
  if (Object.keys(rates).length == 0) {
    console.log("No rates found, updating rates");
    await updateRates(defaultCurrency);
    console.log("Rates updated");
  } else {
    console.log("Rates found!");
  }
}

startup().then(browser.runtime.onMessage.addListener(handleMessage));
