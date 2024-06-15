import googleCurrencyScraper, { CurrencyCode } from "google-currency-scraper";

const rate = googleCurrencyScraper({
  from: CurrencyCode.USD,
  to: CurrencyCode.ILS,
});

rate.then(console.log);
