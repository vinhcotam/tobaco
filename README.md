1. Updating Bower: $ npm update -g bower
2. Updating Gulp : $ npm update -g gulp
3. Cleaning npm: $ npm cache clean
4. Cleaning bower cache: $ bower cache clean
5. Common Issues: $ bower update
6. Error during install about gulp-sass: $ npm uninstall gulp-sass // $ npm uninstall -g gulp-sass
7. Error during install about global node-sass: $ npm uninstall -g node-sass
8. Install the global node-sass first. Then install the gulp-sass module at the local project level: $ npm install -g node-sass (and) $ npm install gulp-sass
9. Now try the npm install again from the project folder: $ npm install 
10. If your npm install still fails at this point: $ npm rebuild -g
11. As suggested above, you can also try npm update: $ npm update -g
12. Loads the seed data: $ npm run seed
13. Run: $ npm start
14. mongoose-tree https://snyk.io/advisor/npm-package/mongoose-tree
15. https://www.npmjs.com/package/mongoose-materialized (tree)

16. run as admin cmd "yo meanjs:crud-module modulename"
=========================================================

rename collection
db.articles.renameCollection("articles1")

use mongodump, it's faster:
mongodump -d <database_name> -o <directory_backup>
mongodump --db somedb --gzip --archive > dump_`date "+%Y-%m-%d"`.gz

And to "restore/import" it (from directory_backup/dump/):
mongorestore -d <database_name> <directory_backup>


https://www.npmjs.com/package/mongoose-embed-populate

=========================================================
user pwd seed ====>user model

cmd: npm start prod ->run as product (need edit 2 file production.js and bower.js)


=======
note upgrade 
1. mongoose-materialized need change to mongoose 7.x (change exec to then-catch)
2. need create /data/uploads folder for keyinformant news


=====document angular
https://docs.angularjs.org/api/ng/directive/ngSelected
