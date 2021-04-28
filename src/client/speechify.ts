import { Data } from '@common';
import { SpeechifyClient, ClientState, ClientEventType, SpeechifyClientListener, HttpSuccessResponse, Player, PlayerEvents } from '@common/client';
import { HttpClient, SpeechPlayer } from './lib';
import CachedQueue from './lib/cachedQueue';

export default class SpeechifyClientImpl implements SpeechifyClient {
  private state: ClientState = ClientState.NOT_PLAYING;
  private subscriber: SpeechifyClientListener | null = null;
  private serverHost: string = '';
  private player: Player;

  constructor(host: string) {
    this.serverHost = host;
    this.player = new SpeechPlayer(new CachedQueue(host));
    this.player.on?.(PlayerEvents.FINISH, () => {
      this.state = ClientState.NOT_PLAYING;
      this.publish();
    })
  }

  private publish(): void {
    this.subscriber &&
      this.subscriber({
        state: this.state,
        type: ClientEventType.STATE,
      });
  }

  async addToQueue(data: Data): Promise<boolean> {
    const url = `${this.serverHost}/api/addToQueue`;
    const { success } = await HttpClient.post<HttpSuccessResponse>(url, data) || {};

    return Boolean(success);
  }

  play(): void {
    this.player.play();
    this.state = ClientState.PLAYING;
    this.publish();
  }

  pause(): void {
    this.player.pause();
    this.state = ClientState.NOT_PLAYING;
    this.publish();
  }

  getState(): ClientState {
    return this.state;
  }

  subscribe(listener: SpeechifyClientListener): () => void {
    this.subscriber = listener;

    return () => (this.subscriber = null);
  }
}
