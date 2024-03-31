'use strict';

describe('Newsprivates E2E Tests:', function () {
  describe('Test Newsprivates page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newsprivates');
      expect(element.all(by.repeater('newsprivate in newsprivates')).count()).toEqual(0);
    });
  });
});
