import DateUtils from './dateUtils';

export default class JsonParser {
  private static parserFunctions: Record<string, (data: string) => string> = {
    'https://slack.com/webhooks/chat': JsonParser.slackMessageParser,
    default: JsonParser.defaultParser,
  };

  constructor() {}

  /**
   * Formats JSON data based on properties
   *
   * @param  {string} key
   * @param  {any} value
   * @returns any
   */
  private static formatJson = (key: string, value: any): any => {
    if (key === 'from' || key === 'channel') {
      return value.substring(1);
    } else if (key === 'timeSent') {
      const date = new Date(parseInt(value));
      const formattedDate = DateUtils.getMMDDYYYY(date);

      return formattedDate;
    }

    return value;
  };

  /**
   * Parses Slack messages data to proper speakable string
   *
   * @param  {string} data
   * @returns string
   */
  private static slackMessageParser(data: string): string {
    const { from, channel, message, timeSent } = JSON.parse(data, JsonParser.formatJson) || {};
    const text = `Next reading:\t You have a Slack message from\t${from}\t in\t${channel} channel:\n ${message}.\n Sent at\t${timeSent}.\n`;

    return text;
  }

  /**
   * Parses any JSON content from unknown source to proper speakable string
   *
   * @param  {string} data
   * @returns string
   */
  private static defaultParser(data: string): string {
    const json = JSON.parse(data);
    let text = 'Next reading:\t JSON with following properties:\n';

    Object.keys(json).forEach((key) => {
      text += `${key}.\t${json[key]}.\n`;
    });

    return text;
  }

  /**
   * Calls JSON parsers based on source
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static parse(source: string, data: string): string {
    return this.parserFunctions[source]?.(data) ?? this.parserFunctions.default(data)
  }
}
