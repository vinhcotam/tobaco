'use strict';

describe('Socialobjectactivities E2E Tests:', function () {
  describe('Test Socialobjectactivities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/socialobjectactivities');
      expect(element.all(by.repeater('socialobjectactivity in socialobjectactivities')).count()).toEqual(0);
    });
  });
});
