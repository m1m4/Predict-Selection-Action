DEF_CURRENCY = "ILS";

async function main() {

  //Handles the user's mouse up event and creates a popup with price information for the selected text.
  document.addEventListener("mouseup", async (e) => {
    
    
    let selection = document.getSelection().toString();
    if (selection) {
      let popup = document.createElement("div");
      popup.id = "selection-popup";

      // Run a function that creates the popup element
      const price = (async () => {
        const prices = extractPrice(selection);
        const currencies = prices.map(([currency, number]) => currency);

        let rate = await browser.runtime.sendMessage({
          command: "get-rates",
          currencies: currencies,
        });

        for (const [currency, number] of prices) {
          const text = `${(number * rate).toFixed(2)} ${DEF_CURRENCY}`;
          let price = document.createElement("div");
          price.className = "_price";
          price.innerText = text;
          popup.appendChild(price);
        }
      })();

      popup.style.top = e.clientY + 2 + "px";
      popup.style.left = e.clientX + 2 + "px";

      document.body.appendChild(popup);
    }
  });

  // Remove the popup when another click is registered
  document.addEventListener("mousedown", (e) => {
    popup = document.getElementById("selection-popup");
    if (popup) {
      document.body.removeChild(popup);
    }
  });

  /**
   * Extracts prices from a given input string, handling different currency symbols and formats.
   *
   * @param {string} input - The input string containing prices.
   * @returns {Array<[string, string]>} - An array of price tuples, where the first element is the currency code and the second element is the price value.
   */
  // TODO: add support for more currencies - use library from https://github.com/albertyw/currency-symbol-map
  function extractPrice(input) {
    // Regex setup
    const currencySymbolRegex = /[$€£¥]/.source;
    const currencyLettersRegex = /[A-Z]{3}/.source;
    const currencyRegex = `(?:${currencyLettersRegex}|${currencySymbolRegex})`;
    const numberRegex = /\d+(?:\.\d+)?/.source;
    const currencyAndNumber = `(${currencyRegex}\\s*${numberRegex}|${numberRegex}\\s*${currencyRegex})`;

    // Find all occurances
    const regex = new RegExp(currencyAndNumber, "g");
    const matches = input.match(regex) ? input.match(regex) : [];

    // Extract currency and number
    let prices = [];

    for (let match of matches) {
      const [
        fullMatch,
        currencyBefore,
        numberAfter,
        numberBefore,
        currencyAfter,
      ] = match.match(
        new RegExp(
          `(${currencyRegex})\\s*(${numberRegex})|(${numberRegex})\\s*(${currencyRegex})`
        )
      );

      const currency = currencyBefore || currencyAfter;
      const number = numberBefore || numberAfter;

      prices.push([currency, number]);
    }

    // Convert currency symbols to currency codes
    prices = prices.map(([currency, number]) => {
      return [convertSymbol(currency), number];
    });

    return prices;
  }

  function convertSymbol(input) {
    const currencySymbols = {
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
}

// Error handler
function handleError(error) {
  console.log(`Error: ${error}`);
}

main().catch(handleError);
