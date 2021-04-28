import { StreamChunk } from '@common';
import CachedQueue, { EMPTY_QUEUE_MESSAGE, CONNECTION_LOST_MESSAGE, MAX_ATTEMPTS } from './cachedQueue';
import HttpClient from './httpClient'


describe('CachedQueue', () => {
  const host = 'http://somehost.com';

  const mockedGet = jest.fn() as jest.Mock;
  HttpClient.get = mockedGet;

  describe('when there are no chunks in the CACHED queue', () => {  
    const chunk: StreamChunk = { text: 'Some text.' };

    beforeEach(() => {
      mockedGet.mockReturnValue({ chunk });
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should ask BE for one', async () => {
      const queue = new CachedQueue(host, []);
      const result = await queue.getChunk();

      expect(result).toEqual(chunk);
    });

    describe('when chunk is returned', () => {
      it('should look ahead and ask BE for one more', async () => {
        const queue = new CachedQueue(host, []);
        await queue.getChunk();

        expect(mockedGet).toHaveBeenCalledTimes(2);
      });
    });

    describe('when no chunk is returned', () => {
      beforeEach(() => {
        mockedGet.mockReturnValue({});
      })

      afterEach(() => {
        jest.clearAllMocks();
      })

      it('should not look ahead', async () => {
        const queue = new CachedQueue(host, []);
        await queue.getChunk();

        expect(mockedGet).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when there are chunks in the CACHED queue', () => {
    const firstChunk: StreamChunk = { text: 'Some text.' };
    const secondChunk: StreamChunk = { text: 'Some different text.' };

    beforeEach(() => {
      mockedGet.mockReturnValue({ chunk: secondChunk });
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should return one from chached queue', async () => {
      const queue = new CachedQueue(host, [firstChunk]);
      const result = await queue.getChunk();

      expect(result).toEqual(firstChunk);
    });

    describe('when chunk is returned', () => {
      it('should look ahead and ask BE for one more', async () => {
        const queue = new CachedQueue(host, [firstChunk]);
        await queue.getChunk();

        expect(mockedGet).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when there are no more chunks in the REMOTE queue', () => {
    beforeEach(() => {
      mockedGet.mockReturnValue({});
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should return a message to warn the user that there are no more readings', async () => {
      const queue = new CachedQueue(host, []);
      const result = await queue.getChunk();

      expect(result).toEqual({ finished: true, text: EMPTY_QUEUE_MESSAGE, lang: 'en-EN' });
    });
  });

  describe('when there is an error different from "Failed to fetch"', () => {
    const error = new Error('Some random error');
    const spy = jest.spyOn(global.console, 'error');

    beforeEach(() => {
      mockedGet.mockRejectedValue(error);
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should return nothing', async () => {
      const queue = new CachedQueue(host, []);
      const result = await queue.getChunk();

      expect(result).toEqual(undefined);
      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  describe('when there is a "Failed to fetch" error', () => {
    const error = new Error('Failed to fetch');
    const chunk: StreamChunk = { text: 'Some text.' };

    beforeEach(() => {
      for (let i = 0; i < 2; i++) {
        mockedGet.mockRejectedValueOnce(error);
      }
      mockedGet.mockReturnValue({ chunk });
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should retry to get next chunk', async () => {
      const queue = new CachedQueue(host, []);
      await queue.getChunk();

      expect(mockedGet).toHaveBeenCalledTimes(4);
    });

    describe('after MAX_ATTEMPTS', () => {
      beforeEach(() => {
        for (let i = 0; i < MAX_ATTEMPTS + 1; i++) {
          mockedGet.mockRejectedValueOnce(error);
        }
      })

      afterEach(() => {
        jest.clearAllMocks();
      })

      it('should warn user that the connection was lost', async () => {
        const queue = new CachedQueue(host, []);
        const result = await queue.getChunk();

        expect(mockedGet).toHaveBeenCalledTimes(MAX_ATTEMPTS);
        expect(result).toEqual({ finished: false, text: CONNECTION_LOST_MESSAGE, lang: 'en-EN' });
      }, 6000);
    });
  });
});