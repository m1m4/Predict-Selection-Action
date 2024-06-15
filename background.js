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

async function handleMessage(request, sender, sendResponse) {
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

  // Check if rates are available and waits if not
  // if (!rates) {
  //   console.log("Waiting for rates to be fetched");

  //   async function waitForRates(changes) {
  //     if (changes.rates) {
  //       rates = changes.rates.newValue;
  //       console.log(rates);
  //     }

  //     browser.storage.local.onChanged.removeListener(waitForRates);
  //   }
  //   browser.storage.local.onChanged.addListener(waitForRates);
  // }

  // const response = await googleCurrencyScraper({
  //   from: request.currencies[0],
  //   to: defaultCurrency,
  // });

  // TODO: add support for all the currencies selected, instead of the first one
  return rates[request.currencies[0]][0];
}

async function startup() {
  // Check if the user has set a default currency
  let defaultCurrency = await browser.storage.local.get("default_currency");
  if (Object.keys(defaultCurrency).length == 0) {
    console.log("No default currency found, setting default currency");
    defaultCurrency = await findUserCurrency();
    await browser.storage.local.set({ default_currency: defaultCurrency });
    console.log("Default currency was set to " + defaultCurrency);
  } else {
    console.log("Default Currency found!");
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
