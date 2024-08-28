# Selection Prediction

An ambitious project for an extension that tries to predict your actions based on your selection and does that for you.
The main idea behind this project is to improve productivity when surfing on the web.

## How to run

Clone the repository and run the following commands:

```javascript
npm i
npm run build
```

Running in Firefox:

1. Go to [firefox dubugging](about:debugging#/runtime/this-firefox)
2. Click "Load Temporary Add-on" and choose the manifest.json file

## Status - 28/08/2024

Currently the project is at a very early stage. It only supports currency conversion
The code for finding conversion rates is outsourced from [this repository](https://github.com/ozgurg/google-currency-scraper) by scraping google.

## Features

- Converts the price you selected to your country's used currency
- Calculates VAT and any other import taxes

## Roadmap/Ideas

- Show the converted price from selected text including shipping/other fees
- Detects that the selected text is a foreign language and translates that for you
- Opens a popup to search the web for your selected text (ie. you selected text in your language, which probably means that you intend to search the web for it)
- Shows an embed of google maps if an address is selected
