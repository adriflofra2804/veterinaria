const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'db.original.json');
const target = path.join(__dirname, 'db.json');

fs.copyFileSync(source, target);
console.log('db.json restaurado al estado inicial.');