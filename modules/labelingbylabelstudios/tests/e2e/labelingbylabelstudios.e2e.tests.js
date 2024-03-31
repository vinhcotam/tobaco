'use strict';

describe('Labelingbylabelstudios E2E Tests:', function () {
  describe('Test Labelingbylabelstudios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/labelingbylabelstudios');
      expect(element.all(by.repeater('labelingbylabelstudio in labelingbylabelstudios')).count()).toEqual(0);
    });
  });
});
