/// <reference types="vite-plugin-svgr/client" />
import styles from "./Conversion.module.css";
import Arrows from "../../../assets/arrows.svg?react";
import Plus from "../../../assets/plus.svg?react";
import Equals from "../../../assets/equals.svg?react";
import { useEffect, useState } from "react";

// Colors for extra prices
const COLORS: { [key: string]: string } = {
  blue: "rgb(69, 158, 240, 0.5)",
  orange: "rgb(230, 131, 40, 0.5)",
  red: "rgb(238, 74, 74, 0.5)",
  purple: "rgb(231, 89, 234, 0.5)",
};

function calculateTaxes(price: number) {
  //Replace with your tax calculations
  if (price > 276) {
    return price * 0.18;
  } else return 0;
}

/**
 * Renders a component that displays an additional price with a tag and colored background.
 *
 * @param price - The price to be displayed.
 * @param currency - The currency of the price.
 * @param tag - The tag to be displayed alongside the price.
 * @param color - The color of the background for the price. can choose any custom color or from the hard coded presets.
 * @returns A React component that displays the additional price.
 */
interface ExtraPriceProps {
  price?: number;
  currency?: string;
  tag?: string;
  color?: string;
}

function ExtraPrice({
  price = 100,
  currency = "USD",
  tag = "Taxes",
  color = "blue",
}: ExtraPriceProps) {
  return (
    <div className={styles.special_price}>
      <p
        className={styles.special_price_text}
        style={{
          backgroundColor: COLORS[color],
        }}
      >
        {price.toFixed(2)} {currency}
      </p>
      <p className={styles.special_price_tag}>{tag}</p>
    </div>
  );
}

/**
 * Renders a component that displays the conversion of a price from one currency to another, including any additional prices or taxes.
 *
 * @param original_price - The original price to be converted.
 * @param original_currency - The currency of the original price.
 * @param converted_price - The converted price.
 * @param converted_currency - The currency of the converted price.
 * @param extra_prices - An optional array of additional prices to be displayed, or a single additional price object based off the ExtraPrice component.
 * @returns A React component that displays the conversion and any additional prices or taxes.
 */
export interface ConversionProps {
  original_price?: number;
  original_currency?: string;
  converted_price?: number;
  converted_currency?: string;
  extra_prices?: ExtraPriceProps | ExtraPriceProps[];
}

export function Conversion({
  original_price = 100,
  original_currency = "USD",
  converted_price = 200,
  converted_currency = "ILS",
  extra_prices = [],
}: ConversionProps) {
  let total: number = converted_price;
  let ExtraPricesElements = [];

  // Add any custom prices listed
  if (Array.isArray(extra_prices)) {
    ExtraPricesElements = extra_prices.map((extra_price) => {
      extra_price.currency = extra_price.currency || converted_currency;
      total += extra_price.price || 0;
      return (
        <>
          <Plus />
          <ExtraPrice {...extra_price} />
        </>
      );
    });
  } else {
    extra_prices.currency = extra_prices.currency || converted_currency;
    ExtraPricesElements = [<ExtraPrice {...extra_prices} />];
    total += extra_prices.price || 0;
  }

  // Add the taxes if any
  const taxes = calculateTaxes(converted_price);
  if (taxes > 0) {
    total += taxes;
    ExtraPricesElements.push(
      <>
        <Plus />
        <ExtraPrice price={taxes} currency={converted_currency} />
      </>
    );
  }

  return (
    <div className={styles.content}>
      <p className={styles.item}>
        {original_price.toFixed(2)} {original_currency}
      </p>
      <Arrows />
      <p className={styles.item}>
        {converted_price.toFixed(2)} {converted_currency}
      </p>
      {ExtraPricesElements}
      <Equals />
      <p className={styles.item} id={styles.total}>
        {total.toFixed(2)} {converted_currency}
      </p>
    </div>
  );
}

/**
 * Renders a component that displays the total conversions for a set of prices.
 *
 * @param prices - An optional array of price tuples, where each tuple contains the currency and price.
 * @returns A React component that displays the total conversions.
 */
export interface TotalCoversionsProps {
  prices?: [string, number][];
}

export function TotalCoversions({
  prices = [["USD", 100]],
}: TotalCoversionsProps) {
  const [rates, setRates] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function fetchRates(currencies: string[]) {
      const fetchedRates = await browser.runtime.sendMessage({
        command: "get-rates",
        currencies: currencies,
      });

      setRates(fetchedRates);
    }

    fetchRates(prices.map(([currency]) => currency));
  }, [prices]);

  // TODO: fetch default currency from background script
  const defaultCurrency = "ILS";

  const conversions = prices.map(([currency, price], index) => {
    const conversionProps = {
      original_price: price,
      original_currency: currency,
      converted_price: price * rates[currency],
      converted_currency: defaultCurrency,
    };

    if (index > 0) {
      return (
        <>
          <div className={styles.divider} />
          <Conversion {...conversionProps} />
        </>
      );
    } else return <Conversion {...conversionProps} />;
  });

  return <div className={styles.container}>{conversions}</div>;
}
