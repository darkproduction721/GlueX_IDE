const http = require('http');

const data = JSON.stringify({
	model: "deepseek-coder:latest",
	messages: [{ role: "user", content: "Hello" }],
	stream: false
});

const req = http.request({
	hostname: '127.0.0.1', port: 11434, path: '/api/chat', method: 'POST',
	headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
}, (res) => {
	let body = '';
	res.on('data', c => body += c);
	res.on('end', () => {
		try {
			const parsed = JSON.parse(body);
			console.log("Success! Response:");
			console.log(JSON.stringify(parsed, null, 2));
		} catch (e) {
			console.error("Error parsing response:", e.message);
			console.error("Body:", body);
		}
	});
});
req.on('error', e => console.error("Request Error:", e.message));
req.write(data);
req.end();
