import { Data, DataType } from '@common';
import { JsonParser } from '../';

describe('JsonParser', () => {
  it('should return data parsed properly (https://slack.com/webhooks/chat)', () => {
    const jsonData: Data = {
      type: DataType.JSON,
      source: 'https://slack.com/webhooks/chat',
      data: `
        {
          "from": "@anson",
          "channel": "#chrome-extension",
          "message": "Can you please check the latest PR? I just updated the API",
          "timeSent": "611749161"
        }`,
    };
    const parsedText = JsonParser.parse(jsonData.source, jsonData.data);

    expect(parsedText).toEqual(
      'Next reading:\t You have a Slack message from\tanson\t in\tchrome-extension channel:\n Can you please check the latest PR? I just updated the API.\n Sent at\t01-08-1970.\n'
    );
  });

  it('should return data parsed properly (default)', () => {
    const jsonData: Data = {
      type: DataType.JSON,
      source: 'https://someweb/messages',
      data: `
        {
          "property1": "someValue",
          "property2": "someOtherValue",
          "property3": "last value"
        }`,
    };
    const parsedText = JsonParser.parse(jsonData.source, jsonData.data);

    expect(parsedText).toEqual(
      'Next reading:\t JSON with following properties:\nproperty1.\tsomeValue.\nproperty2.\tsomeOtherValue.\nproperty3.\tlast value.\n'
    );
  });
});
