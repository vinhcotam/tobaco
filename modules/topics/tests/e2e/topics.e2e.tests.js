'use strict';

describe('Topics E2E Tests:', function () {
  describe('Test Topics page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/topics');
      expect(element.all(by.repeater('topic in topics')).count()).toEqual(0);
    });
  });
});
