'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        /*default for framework*/
        // bower:css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        // endbower
        /*end default for framework*/
        'public/lib/adminlte3/plugins/fontawesome-free/css/all.min.css',
        'public/lib/bootstrap-4.0.0/dist/css/bootstrap.min.css',
        'public/lib/adminlte3/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
        'public/lib/adminlte3/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
        'public/lib/adminlte3/plugins/jqvmap/jqvmap.min.css',
        'public/lib/adminlte3/plugins/fontawesome-free/css/all.min.css',
        'public/lib/adminlte3/dist/css/adminlte.min.css',
        'public/lib/adminlte3/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
        'public/lib/adminlte3/plugins/daterangepicker/daterangepicker.css',
        'public/lib/adminlte3/plugins/summernote/summernote-bs4.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/multiselect/css/style.css'
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
