import { StreamChunk } from '@common';
import { HttpNextChunkResponse, ChunkQueue } from '@common/client';
import { HttpClient } from '.';

export const EMPTY_QUEUE_MESSAGE = 'End of your readings list.';
export const CONNECTION_LOST_MESSAGE = "Internet connection lost. We will resume your readings once it's back.";
export const MAX_ATTEMPTS = 5

export default class CachedQueue implements ChunkQueue {
  private queue: Array<StreamChunk>;
  private host: string;
  private pollingCancelled: boolean = false;
  private retryAttempts: number = 0;
  private pollingInterval: number = 1000;

  constructor(host: string, queue: Array<StreamChunk> = []) {
    this.queue = queue;
    this.host = host;
  }

  /**
   * Asks for more chunks ahead in time
   *
   * @returns Promise {void}
   */
  private async lookAhead(): Promise<void> {
    const { chunk } = (await HttpClient.get<HttpNextChunkResponse>(`${this.host}/api/getNextChunk`)) || {};

    chunk && this.queue.push(chunk);
    this.retryAttempts = 0;
  }

  /**
   * Retries chunk request every second
   *
   * @returns Promise {StreamChunk}
   */
  private retry = (): Promise<StreamChunk | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.getChunk()), this.pollingInterval);
    });
  };

  /**
   * If fetch failed because of a connection error, it retries the request. Alerts user about it after 5 retying attempts
   *
   * @param  {Error} err Error returned from http request
   * @returns Promise {StreamChunk} | void
   */
  private async errorHandler(err: Error): Promise<StreamChunk | undefined> {
    if (err.message === 'Failed to fetch' && !this.pollingCancelled) {
      this.retryAttempts++;

      if (this.retryAttempts === MAX_ATTEMPTS) {
        return { finished: false, text: CONNECTION_LOST_MESSAGE, lang: 'en-EN' };
      }

      return this.retry();
    } else {
      console.error(err);
    }

    this.pollingCancelled = false;
    return;
  }
  
  /**
   * Gets the next chunk from cache queue, or asks BE for more chunks
   *
   * @returns Promise {StreamChunk}
   */
  async getChunk(): Promise<StreamChunk | undefined> {
    let chunk: StreamChunk | undefined;

    try {
      if (this.queue.length) {
        chunk = this.queue.shift();
      } else {
        const { chunk: nextChunk } = (await HttpClient.get<HttpNextChunkResponse>(`${this.host}/api/getNextChunk`)) || {};
        chunk = nextChunk;
      }

      chunk && this.lookAhead();

      /**
        If there is no chunk, it means the queue is
        synced with BE and there are no more chunks to read
      */
      return chunk || { finished: true, text: EMPTY_QUEUE_MESSAGE, lang: 'en-EN' };
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  /**
   * Prevents queue from keep asking BE in case of internet connection failure
   *
   * @returns void
   */
  cancelRetry(): void {
    this.retryAttempts = 0;
    this.pollingCancelled = true;
  }
}
