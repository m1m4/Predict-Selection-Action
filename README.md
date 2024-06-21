# Selection Prediction

An ambitious project for an extension that tries to predict your actions based on your selection and does that for you.
The main idea behind this project is to improve productivity when surfing on the web.

## How to run

Compiling and bundling the extension:

1. Clone repository
2. Install all dependencies ("npm install")
3. Run "npm run build" to bundle the scripts

Running in Firefox:

1. Go to the "about:debugging#/runtime/this-firefox"
2. Click "Load Temporary Add-on" and choose the manifest.json file

## Status - 16/06/2024

Currently the project is at a very early stage. It only supports currency conversion

## Features

- Converts the price you selected to your country's used currency

## Roadmap/Ideas

- Show the converted price from selected text including import taxes + shipping
- Detects that selected text is a foreign language and translates that for you
- Opens a popup to search the web for your selected text (ie. you selected text in your language, which probably means that you intend to search the web for it)
