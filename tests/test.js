var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function convertSymbol(input) {
    var currencySymbols = {
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
function extractPrice(input) {
    // Regex setup
    var currencySymbolRegex = /[$€£¥]/.source;
    var currencyLettersRegex = /[A-Z]{3}/.source;
    var currencyRegex = "(?:".concat(currencyLettersRegex, "|").concat(currencySymbolRegex, ")");
    var numberRegex = /\d+(?:\.\d+)?/.source;
    var currencyAndNumber = "(".concat(currencyRegex, "\\s*").concat(numberRegex, "|").concat(numberRegex, "\\s*").concat(currencyRegex, ")");
    // Find all occurances
    var regex = new RegExp(currencyAndNumber, "g");
    var matches = input.match(regex);
    // Extract currency and number
    var prices = [];
    for (var _i = 0, _a = __spreadArray([], matches !== null && matches !== void 0 ? matches : [], true); _i < _a.length; _i++) {
        var match = _a[_i];
        var _b = match.match(new RegExp("(".concat(currencyRegex, ")\\s*(").concat(numberRegex, ")|(").concat(numberRegex, ")\\s*(").concat(currencyRegex, ")"))) || [], fullMatch = _b[0], currencyBefore = _b[1], numberAfter = _b[2], numberBefore = _b[3], currencyAfter = _b[4];
        var currency = currencyBefore || currencyAfter;
        var number = numberBefore || numberAfter;
        //   prices.push([currency, number]);
    }
    // Convert currency symbols to currency codes
    prices = prices.map(function (_a) {
        var currency = _a[0], number = _a[1];
        return [convertSymbol(currency), number];
    });
    return prices;
}
var text = "$1000";
console.log(extractPrice(text));
