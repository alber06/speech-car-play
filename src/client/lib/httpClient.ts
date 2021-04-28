export default class HttpClient {
  constructor() { }

  /**
   * Makes a request to the provided url
   *
   * @param  {RequestInfo} requestInfo
   * @returns Promise {T}
   */
  private static async request<T>(requestInfo: RequestInfo): Promise<T> {
    const response = await fetch(requestInfo);
    const body = await response.json();

    return body || {};
  }

  /**
   * Makes a GET request
   *
   * @param  {string} url
   * @param  {RequestInit} args
   * @param  {Object} [args.headers]
   * @param  {Object} [args.method]
   * @returns Promise {T}
   */
  static get<T>(
    url: string,
    args: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  ): Promise<T> {
    return this.request<T>(new Request(url, args));
  }

  /**
   * Makes a POST request
   *
   * @param  {string} url
   * @param  {RequestInit} args
   * @param  {Object} [args.headers]
   * @param  {Object} [args.method]
   * @param  {Object} args.body
   * @returns Promise {T}
   */
  static async post<T>(
    url: string,
    body: any,
    args: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    }
  ): Promise<T | void> {
    try {
      return await this.request<T>(new Request(url, args));
    } catch (err) {
      const errorMessage: string = err.message === 'Failed to fetch' ?
        'Internet connection lost. Please try again later.' :
        'There\'s been a problem. Please try again later.'

      window.alert(errorMessage)
    }
  }
}
