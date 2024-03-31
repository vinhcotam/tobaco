'use strict';

/**
 * Module dependencies
 */
var labelingbylabelstudiosPolicy = require('../policies/labelingbylabelstudios.server.policy'),
  labelingbylabelstudios = require('../controllers/labelingbylabelstudios.server.controller');

module.exports = function(app) {
  // Labelingbylabelstudios Routes
  app.route('/api/labelingbylabelstudios').all(labelingbylabelstudiosPolicy.isAllowed)
    .get(labelingbylabelstudios.list)
    .post(labelingbylabelstudios.create);

  app.route('/api/labelingbylabelstudios/:labelingbylabelstudioId').all(labelingbylabelstudiosPolicy.isAllowed)
    .get(labelingbylabelstudios.read)
    .put(labelingbylabelstudios.update)
    .delete(labelingbylabelstudios.delete);

  // Finish by binding the Labelingbylabelstudio middleware
  app.param('labelingbylabelstudioId', labelingbylabelstudios.labelingbylabelstudioByID);
};
