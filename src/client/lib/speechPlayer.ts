import { StreamChunk } from '@common';
import { Player, PlayerEvents, ChunkQueue } from '@common/client';
import UtteranceTrack from '../models/UtteranceTrack';

export default class SpeechPlayer implements Player {
  private player: SpeechSynthesis;
  private queue: ChunkQueue;
  private events: Record<PlayerEvents, Array<() => void>> = {
    [PlayerEvents.FINISH]: []
  };

  constructor(queue: ChunkQueue) {
    if ('speechSynthesis' in window) {
      this.player = window.speechSynthesis;
      this.queue = queue;
    } else {
      throw new Error('Your browser does not support this feature');
    }
  }

  /**
   * Plays next chunk after 1 second
   *
   * @returns void
   */
  private onEndHandler = (): void => {
    setTimeout(() => {
      this.play();
    }, 1000);
  }

  /**
   * Notifies all subscribers that a concrete event happened
   * @param  {string} event
   * @returns void
   */
  private notify = (event: PlayerEvents): void => {
    this.events[event].forEach(cb => cb())
  }

  /**
   * Starts or resumes player
   *
   * @returns Promise {void}
   */
  async play(): Promise<void> {
    // Hack to make it work on chrome
    this.player.cancel();
    
    if (this.player.paused) {
      this.player.resume();
    } else {
      const chunk: StreamChunk | undefined = await this.queue.getChunk();
      const onEnd = chunk && !chunk.finished
      ? this.onEndHandler
      : () => this.notify(PlayerEvents.FINISH);
      const track: UtteranceTrack = new UtteranceTrack(chunk, onEnd);

      this.player.speak(track.getUtterance());
    }
  }

  /**
   * Pauses player or cancels queue streaming
   *
   * @returns void
   */
  pause(): void {
    this.player.speaking ?
      this.player.pause() :
      this.queue.cancelRetry?.();
  }
  
  /**
   * Subscribe to a particular event
   * 
   * @param  {string} event
   * @param  {()=>void} cb
   */
  on(event: PlayerEvents, cb: () => void) {
    this.events[event]?.push(cb)
  }
}
