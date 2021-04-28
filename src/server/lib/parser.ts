import { Data, DataType } from '@common';
import { JsonParser, TxtParser, HtmlParser } from './parsers';

export default class Parser {
  constructor() {}

  /**
   * Calls parsers based on Data type and source
   *
   * @param  {Object} data
   * @param  {string} data.type
   * @param  {string} data.source
   * @param  {string} data.data
   * @returns string
   */
  static parse({ type, source, data }: Data): string {
    return this[type] ? this[type](source, data) : this[DataType.TXT]('default', data);
  }

  /**
   * Calls JSON parser based on source
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static [DataType.JSON](source: string, data: string): string {
    return JsonParser.parse(source, data);
  }

  /**
   * Calls HTML parser based on source
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static [DataType.HTML](source: string, data: string): string {
    return HtmlParser.parse(source, data);
  }

  /**
   * Calls TXT parser based on source
   *
   * @param  {string} source
   * @param  {string} data
   * @returns string
   */
  static [DataType.TXT](source: string, data: string): string {
    return TxtParser.parse(source, data);
  }
}
