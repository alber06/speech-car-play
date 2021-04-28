import { Data, DataType } from '@common';
import Parser from './parser';

let mockParseTxt: jest.Mock
let mockParseJson: jest.Mock
let mockParseHtml: jest.Mock


  jest.mock('./parsers', () => {
    mockParseTxt = jest.fn()
    mockParseJson = jest.fn()
    mockParseHtml = jest.fn()

    return {
      TxtParser: {
        parse: mockParseTxt.mockImplementation(() => {
          return ''
        })
      },
      JsonParser: {
        parse: mockParseJson.mockImplementation(() => {
          return ''
        })
      },
      HtmlParser: {
        parse: mockParseHtml.mockImplementation(() => {
          return ''
        })
      }
    }
  })

describe('Parser', () => {
  afterEach(() => {
    mockParseTxt.mockClear()
    mockParseJson.mockClear()
    mockParseHtml.mockClear()
  })

  it('should return data formatted based on type (TXT)', () => {
    const txtData: Data = {
      type: DataType.TXT,
      source: 'feeds.stock-ticker',
      data: 'AMZN\t3232.58\tUSD\nFB\t272.14\tUSD\nAAPL\t142.06\tUSD\nNFLX\t523.28\tUSD',
    };
    Parser.parse(txtData);

    expect(mockParseTxt).toHaveBeenCalledWith(txtData.source, txtData.data);
  });

  it('should return data formatted based on type (JSON)', () => {
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
    Parser.parse(jsonData);

    expect(mockParseJson).toHaveBeenCalledWith(jsonData.source, jsonData.data);
  });

  it('should return data formatted based on type (HTML)', () => {
    const htmlData: Data = {
      type: DataType.HTML,
      source: `https://speechify.com/welcome`,
      data: `
        <html>
          <body>
            <div id="speechify-heading">
            <h1>Welcome to Speechify</h1>
            <div id="speechify-paragraphs">
              <p>Speechify helps you listen to any readable content on the web.</p>
              <p> The product works on web articles, PDFs and Google Docs.</p>
            </div>
          </body>
        </html>`
    };
    Parser.parse(htmlData);

    expect(mockParseHtml).toHaveBeenCalledWith(htmlData.source, htmlData.data);
  });
});