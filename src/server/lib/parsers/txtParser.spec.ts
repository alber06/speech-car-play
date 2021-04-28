import { Data, DataType } from '@common';
import { TxtParser } from '.';

describe('TxtParser', () => {
  it('should return data parsed properly (feeds.stock-ticker)', () => {
    const txtData: Data = {
      type: DataType.TXT,
      source: 'feeds.stock-ticker',
      data: 'AMZN\t3232.58\tUSD\nFB\t272.14\tUSD\nAAPL\t142.06\tUSD\nNFLX\t523.28\tUSD',
    };
    const parsedText = TxtParser.parse(txtData.source, txtData.data);

    expect(parsedText).toEqual(
      'Next reading:\t List of today stocks:\nAMZN is \t3232.58	US Dollars.\nFB is \t272.14	US Dollars.\nAAPL is \t142.06	US Dollars.\nNFLX is \t523.28	US Dollars.\n'
    );
  });

  it('should return data parsed properly (default)', () => {
    const txtData: Data = {
      type: DataType.TXT,
      source: 'some.source',
      data: 'Some\ttext\nsome other\tline.',
    };
    const parsedText = TxtParser.parse(txtData.source, txtData.data);

    expect(parsedText).toEqual(
      'Next reading:\t Text that says:\n Some\ttext\nsome other\tline.'
    );
  });
});
