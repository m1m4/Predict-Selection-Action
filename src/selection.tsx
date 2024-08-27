/**
 * Extracts prices from a given input string, handling different currency symbols and formats.
 *
 * @param {string} input - The input string containing prices.
 * @returns {Array<[string, number]>} - An array of price tuples, where the first element is the currency code and the second element is the price value.
 */
// TODO: add support for more currencies - use library from https://github.com/albertyw/currency-symbol-map
function convertSymbol(input: string) {
  const currencySymbols: { [key: string]: string } = {
    $: "USD",
    "£": "GBP",
    "€": "EUR",
    "¥": "JPY",
    "₩": "KRW",
    "₪": "ILS",
    "₹": "INR",
    "₽": "RUB",
  };

  return currencySymbols[input] || input;
}

function extractPrice(input: string) {
  // Regex setup
  const currencySymbolRegex = /[$€£¥]/.source;
  const currencyLettersRegex = /[A-Z]{3}/.source;
  const currencyRegex = `(?:${currencyLettersRegex}|${currencySymbolRegex})`;
  const numberRegex = /\d+(?:\.\d+)?/.source;
  const currencyAndNumber = `(${currencyRegex}\\s*${numberRegex}|${numberRegex}\\s*${currencyRegex})`;

  // Find all occurances
  const regex = new RegExp(currencyAndNumber, "g");
  const matches = input.match(regex);

  // Extract currency and number
  let prices: Array<[string, number]> = [];

  for (const match of [...(matches ?? [])]) {
    const [, currencyBefore, numberAfter, numberBefore, currencyAfter] =
      match.match(
        new RegExp(
          `(${currencyRegex})\\s*(${numberRegex})|(${numberRegex})\\s*(${currencyRegex})`
        )
      ) || [];

    const currency = currencyBefore || currencyAfter;
    const number = Number(numberBefore || numberAfter);

    prices.push([currency, number]);
  }

  // Convert currency symbols to currency codes
  prices = prices.map(([currency, number]) => {
    return [convertSymbol(currency), number];
  });

  return prices;
}

// #TODO: predict more use cases
/**
 * Predicts the use of a given selection of text.
 *
 * @param selection - The text selection to analyze.
 * @returns A tuple containing the predicted use and it's component props
 */
export function predictUse(selection: string): [string, unknown] {
  const prices = extractPrice(selection);

  if (prices.length > 0) {
    return ["conversion", { prices: prices }];
  }

  // Default
  return ["none", null];
}
