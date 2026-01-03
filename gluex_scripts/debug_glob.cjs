const path = require('path');
// Mocking the dependencies logic
const REPO_ROOT = path.resolve('.');
const WEB_FOLDER = path.join(REPO_ROOT, 'remote', 'web');

// Simulation of getProductionDependencies output (just some paths)
const productionDependencies = [
	path.join(REPO_ROOT, 'node_modules', 'foo'),
	path.join(REPO_ROOT, 'node_modules', 'bar')
];

console.log('REPO_ROOT:', REPO_ROOT);
const relativeDeps = productionDependencies.map(d => path.relative(REPO_ROOT, d));
console.log('Relative deps:', relativeDeps);

const dependenciesSrc = relativeDeps.map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat().map(s => s.replace(/\\/g, '/'));

console.log('dependenciesSrc:', dependenciesSrc);

// Verify if any contain backslashes
const hasBackslash = dependenciesSrc.some(s => s.includes('\\'));
console.log('Has backslash:', hasBackslash);
