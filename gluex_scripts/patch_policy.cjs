const fs = require('fs');
const path = 'out/vs/platform/policy/node/nativePolicyService.js';
let content = fs.readFileSync(path, 'utf8');
const target = "const { createWatcher } = await import('@vscode/policy-watcher');";
const replacement = `
let createWatcher;
try {
    const mod = await import('@vscode/policy-watcher');
    createWatcher = mod.createWatcher;
} catch (e) {
    console.warn('Using mock policy-watcher');
    createWatcher = () => ({ dispose: () => {} });
}
`;
if (content.includes(target)) {
	content = content.replace(target, replacement);
	fs.writeFileSync(path, content);
	console.log("Patched successfully.");
} else {
	console.log("Target not found (already patched?).");
}
