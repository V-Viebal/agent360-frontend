const fs = require('fs');
const jsPath = 'projects/agent360/frontend/dist/assets/index-DhmfErsu.js';
const code = fs.readFileSync(jsPath, 'utf8');

const matches = code.match(/aside",\{className:[^}]+/g);
console.log('Matches:', matches);
