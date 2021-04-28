import { Data, StreamChunk } from '@common';

export enum ClientEventType {
  STATE,
}

export enum ClientState {
  PLAYING,
  NOT_PLAYING,
}

type ClientStateEvent = {
  type: ClientEventType.STATE;
  state: ClientState;
};

export type SpeechifyClientEvent = ClientStateEvent;

export type SpeechifyClientListener = (event: SpeechifyClientEvent) => void;

export interface SpeechifyClient {
  addToQueue(data: Data): Promise<boolean>;
  play(): void;
  pause(): void;
  getState(): ClientState;
  subscribe(listener: SpeechifyClientListener): () => void;
}

export type HttpSuccessResponse = {
  success: boolean;
};

export type HttpNextChunkResponse = {
  chunk: StreamChunk;
};

export interface ChunkQueue {
  getChunk(): Promise<StreamChunk | undefined>,
  cancelRetry?(): void
}

export enum PlayerEvents {
  FINISH
}

export interface Player {
  play(): void,
  pause(): void,
  on?(event: PlayerEvents, cb: () => void ): void
}
