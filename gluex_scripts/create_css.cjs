const fs = require('fs');
const path = require('path');
const target = 'out/vs/workbench/workbench.web.main.css';
if (!fs.existsSync(path.dirname(target))) {
	fs.mkdirSync(path.dirname(target), { recursive: true });
}
fs.writeFileSync(target, '/* Temporary empty CSS */');
console.log('Created ' + target);
