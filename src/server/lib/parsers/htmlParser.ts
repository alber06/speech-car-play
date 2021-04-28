import { htmlToText } from 'html-to-text';

export default class HtmlParser {
  constructor() {}

  /**
   * Picks the domain from a url
   *
   * @param  {string} url
   * @returns string
   */
  private static getDomain(url: string): string {
    const splittedUrl = url.split('/', 3);

    return splittedUrl[2];
  }

  /**
   * Transforms HTML data to speakable string
   *
   * @param  {string} domain
   * @param  {string} data
   * @returns string
   */
  private static defaultParser(domain: string, data: string): string {
    const parsedHtml = htmlToText(data, {
      preserveNewlines: true,
      noLinkBrackets: true,
      ignoreHref: true,
      ignoreImage: true,
    })
      .replace(/>/gm, '')
      .replace(/s"\//gm, 's"/>')
      .replace(/&/g, ' and ')
      .replace(/orm-interview-snippet:/g, '')
      .replace(/orm:swap-title:/g, '');
    const text = `Next reading:\t Web content from\t ${domain}:\t\n ${parsedHtml}`;

    return text;
  }

  /**
   * Parses any HTML content to proper speakable string
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static parse(source: string, data: string): string {
    const domain = this.getDomain(source);

    return this.defaultParser(domain, data);
  }
}
