# tobaco
Updating Bower: $ npm update -g bower
Updating Gulp : $ npm update -g gulp
Cleaning npm: $ npm cache clean
Cleaning bower cache: $ bower cache clean
Common Issues: $ bower update
Error during install about gulp-sass: $ npm uninstall gulp-sass // $ npm uninstall -g gulp-sass
Error during install about global node-sass: $ npm uninstall -g node-sass
Install the global node-sass first. Then install the gulp-sass module at the local project level: $ npm install -g node-sass (and) $ npm install gulp-sass
Now try the npm install again from the project folder: $ npm install
If your npm install still fails at this point: $ npm rebuild -g
As suggested above, you can also try npm update: $ npm update -g
Loads the seed data: $ npm run seed
Run: $ npm start
mongoose-tree https://snyk.io/advisor/npm-package/mongoose-tree
https://www.npmjs.com/package/mongoose-materialized (tree)

run as admin cmd “yo meanjs:crud-module modulename”

=========================================================

rename collection db.articles.renameCollection(“articles1”)

use mongodump, it’s faster: mongodump -d -o mongodump --db somedb --gzip --archive > dump_date "+%Y-%m-%d".gz

And to “restore/import” it (from directory_backup/dump/): mongorestore -d

https://www.npmjs.com/package/mongoose-embed-populate

========================================================= user pwd seed ====>user model

cmd: npm start prod ->run as product (need edit 2 file production.js and bower.js)

======= note upgrade

mongoose-materialized need change to mongoose 7.x (change exec to then-catch)
need create /data/uploads folder for keyinformant news
=====document angular https://docs.angularjs.org/api/ng/directive/ngSelected
