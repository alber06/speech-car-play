import { Data, DataType } from '@common';
import { HtmlParser } from '.';

describe('HtmlParser', () => {
  it('should return data parsed properly (https://speechify.com/welcome)', () => {
    const domain = 'speechify.com'
    const htmlData: Data = {
      type: DataType.HTML,
      source: `https://${domain}/welcome`,
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
    const parsedText = HtmlParser.parse(htmlData.source, htmlData.data);

    expect(parsedText).toEqual(
      `Next reading:\t Web content from\t ${domain}:\t\n \n\n\n\n\n\nWELCOME TO SPEECHIFY\n\n\n\n\n\n\nSpeechify helps you listen to any readable content on the web.\n\n\n\n\nThe product works on web articles, PDFs and Google Docs.\n\n\n\n\n`
    );
  });

  it('should return data parsed properly (https://myweb.com/users)', () => {
    const domain = 'myweb.com'
    const htmlData: Data = {
      type: DataType.HTML,
      source: `https://${domain}/welcome`,
      data: `
        <html>
          <body>
            <div id="heading">
              <h1>Some header</h1>
            </div>
            <p>Some paragraph.</p>
          </body>
        </html>`
    };
    const parsedChunk = HtmlParser.parse(htmlData.source, htmlData.data);

    expect(parsedChunk).toEqual(
      `Next reading:\t Web content from\t ${domain}:\t\n \n\n\n\n\n\nSOME HEADER\n\n\n\n\n\n\nSome paragraph.\n\n\n`
    );
  });
});
