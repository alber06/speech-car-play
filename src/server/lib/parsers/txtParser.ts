export default class TxtParser {
  private static parserFunctions: Record<string, (data: string) => string> = {
    'feeds.stock-ticker': TxtParser.stockTickerParser,
    default: TxtParser.defaultParser,
  };

  constructor() {}

  /**
   * Parses stock-ticker feeds data to proper speakable string
   *
   * @param  {string} data
   * @returns string
   */
  private static stockTickerParser(data: string): string {
    const currencies: Record<string, string> = {
      USD: 'US Dollars',
    };
    const stocks: string[] = data.split('\n');
    let text = 'Next reading:\t List of today stocks:\n';

    stocks.forEach((stock) => {
      const stockParts: string[] = stock.split('\t');
      text += `${stockParts[0]} is \t${stockParts[1]}\t${currencies[stockParts[2]]}.\n`;
    });

    return text;
  }

  /**
   * Parses any TXT content from unknown source to proper speakable string
   *
   * @param  {string} data
   * @returns string
   */
  private static defaultParser(data: string): string {
    return `Next reading:\t Text that says:\n ${data}`;
  }

  /**
   * Calls TXT parsers based on source
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static parse(source: string, data: string): string {
    return this.parserFunctions[source]?.(data) ?? this.parserFunctions.default(data);
  }
}
