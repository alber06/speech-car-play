export default class DateUtils {
  constructor() {}

  /**
   * Returns date in MM-DD-YYYY format string
   *
   * @param  {Date} date
   * @returns string
   */
  static getMMDDYYYY(date: Date): string {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
      date.getFullYear()
    ].join('-');
  }
}
