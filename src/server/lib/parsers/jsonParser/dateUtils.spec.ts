import DateUtils from "./dateUtils";

describe('DateUtils', () => {
  describe('getMMDDYYYY', () => {
    it('should return date with MM-DD-YYYY format', () => {
      const date = new Date('2022/02/05');
      const formattedDate = DateUtils.getMMDDYYYY(date);
      const expectedDate = '02-05-2022';

      expect(formattedDate).toEqual(expectedDate);
    });
  });
});