// deploy.js
import { writeFileSync } from 'fs';

// Update .npmrc for deployment with platform-agnostic settings
const npmrcContent = `
# Cross-platform configuration
node-linker=hoisted
public-hoist-pattern[]=*swc*
`;

writeFileSync('.npmrc', npmrcContent);
console.log('Updated .npmrc with platform-agnostic settings');