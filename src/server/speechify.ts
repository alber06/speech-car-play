import { Data, StreamChunk } from '@common';
import { SpeechifyServer } from '@common/server';
import Parser from './lib/parser';

export default class MySpeechify implements SpeechifyServer {
  private queue: StreamChunk[] = [];

  constructor() {}

  addToQueue(data: Data): boolean {
    try {
      const chunk: StreamChunk = {
        lang: 'en-EN',
        text: Parser.parse(data),
        finished: false,
      };

      this.queue.push(chunk);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  getNextChunk(): StreamChunk | undefined {
    const nextChunk: StreamChunk | undefined = this.queue.shift();

    return nextChunk;
  }
}
