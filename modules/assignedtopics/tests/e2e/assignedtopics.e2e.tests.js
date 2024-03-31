'use strict';

describe('Assignedtopics E2E Tests:', function () {
  describe('Test Assignedtopics page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/assignedtopics');
      expect(element.all(by.repeater('assignedtopic in assignedtopics')).count()).toEqual(0);
    });
  });
});
