import { StreamChunk } from "@common";

export default class UtteranceTrack {
  private utterance: SpeechSynthesisUtterance;

  constructor(streamChunk: StreamChunk | undefined, onEndHandler: (() => void) | null) {
    this.utterance = new SpeechSynthesisUtterance(streamChunk?.text)
    this.utterance.volume = streamChunk?.volume || 1.4;
    this.utterance.lang = streamChunk?.lang || 'en-US'; // Would be navigator.language, but onend handler is not firing with non-english voices

    this.utterance.onend = onEndHandler
  }

  getUtterance(): SpeechSynthesisUtterance {
    return this.utterance
  }
}