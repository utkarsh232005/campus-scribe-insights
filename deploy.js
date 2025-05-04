// deploy.js
const fs = require('fs');

// Update .npmrc for deployment
const npmrcContent = `
platform=linux
node-linker=hoisted
public-hoist-pattern[]=*rollup*
public-hoist-pattern[]=*swc*
`;

fs.writeFileSync('.npmrc', npmrcContent);
console.log('Updated .npmrc for deployment');