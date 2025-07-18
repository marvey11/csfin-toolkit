import {
  getDateObject,
  parseNumberWithAutoLocale,
  QuoteData,
  QuoteItem,
  Transaction,
} from "@csfin-toolkit/core";
import { RawQuoteData, RawQuoteItem, RawTransaction } from "./types";

const convertToTransaction = (data: RawTransaction): Transaction => {
  const { executionDate, type, shares, price, totalFees } = data;
  return new Transaction(
    getDateObject(executionDate),
    convertRawType(type),
    // when selling shares, the amount is listed in negavtive numbers; we need to reverse that
    Math.abs(parseNumberWithAutoLocale(shares)),
    parseNumberWithAutoLocale(price),
    null, // stock exchange is not listed
    // fees are listed in negative numbers; we need to reverse that
    Math.abs(parseNumberWithAutoLocale(totalFees))
  );
};

const convertRawType = (rawType: string): "BUY" | "SELL" => {
  if (rawType === "Kauf") {
    return "BUY";
  }
  if (rawType === "Verkauf") {
    return "SELL";
  }
  throw new Error(`Invalid raw transaction type: ${rawType}`);
};

const convertToQuoteData = (data: RawQuoteData): QuoteData => {
  const { name, nsin, exchange, items } = data;
  return {
    name,
    nsin,
    exchange,
    items: items.map(convertToQuoteItem),
  };
};

const convertToQuoteItem = (data: RawQuoteItem): QuoteItem => {
  const { date, price } = data;
  return new QuoteItem(date, parseNumberWithAutoLocale(price));
};

export { convertToQuoteData, convertToTransaction };
