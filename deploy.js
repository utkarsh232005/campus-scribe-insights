// deploy.js
import { writeFileSync } from 'fs';
import { platform } from 'os';

// Get the current operating system
const currentPlatform = platform();
console.log(`Detected platform: ${currentPlatform}`);

// Update .npmrc for deployment with platform-agnostic settings
const npmrcContent = `
# Cross-platform configuration
node-linker=hoisted
public-hoist-pattern[]=*swc*
`;

writeFileSync('.npmrc', npmrcContent);
console.log('Updated .npmrc with platform-agnostic settings');

// Additional log to help with debugging deployment
console.log('Deploy script completed successfully');