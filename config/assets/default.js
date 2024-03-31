'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
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
        //old
        //'public/lib/bootstrap/dist/css/bootstrap.css',
        //'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/multiselect/css/style.css'
        // endbower
      ],
      js: [
        // bower:js
        
        //the system
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        //theme
        'public/lib/adminlte3/plugins/jquery/jquery.min.js',
        'public/lib/adminlte3/plugins/jquery-ui/jquery-ui.min.js',
        'public/lib/adminlte3/plugins/bootstrap/js/bootstrap.bundle.min.js',
        'public/lib/adminlte3/plugins/chart.js/Chart.min.js',
        'public/lib/adminlte3/plugins/sparklines/sparkline.js',
        'public/lib/adminlte3/plugins/jqvmap/jquery.vmap.min.js',
        'public/lib/adminlte3/plugins/jqvmap/maps/jquery.vmap.usa.js',
        'public/lib/adminlte3/plugins/jquery-knob/jquery.knob.min.js',
        'public/lib/adminlte3/plugins/moment/moment.min.js',
        'public/lib/adminlte3/plugins/daterangepicker/daterangepicker.js',
        'public/lib/adminlte3/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
        'public/lib/adminlte3/plugins/summernote/summernote-bs4.min.js',
        'public/lib/adminlte3/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
        'public/lib/adminlte3/dist/js/adminlte.js',
        'public/lib/adminlte3/dist/js/demo.js',
        'public/lib/multiselect/dist/js/multiselect.min.js'
        /*'public/lib/adminlte3/dist/js/pages/dashboard.js'*/
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
