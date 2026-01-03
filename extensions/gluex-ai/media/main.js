(function () {
	const vscode = acquireVsCodeApi();
	const messagesContainer = document.querySelector('.messages');
	const textArea = document.querySelector('textarea');
	const sendButton = document.querySelector('#send-button');

	const modelSelector = document.querySelector('#model-selector');

	// Auto-resize textarea
	textArea.addEventListener('input', function () {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
		if (this.value.trim() === '') {
			sendButton.disabled = true;
		} else {
			sendButton.disabled = false;
		}
	});

	// Handle Enter key to submit
	textArea.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	});

	sendButton.addEventListener('click', sendMessage);

	modelSelector.addEventListener('change', () => {
		if (modelSelector.value === 'claude') {
			addMessage('assistant', 'Claude Support is coming soon! Switching back to General Mode for now.');
			modelSelector.value = 'general';
		}
	});

	window.addEventListener('message', event => {
		const message = event.data;
		switch (message.type) {
			case 'addMessage':
				addMessage(message.role, message.text);
				break;
			case 'updateLastMessage':
				updateLastMessage(message.text);
				break;
		}
	});

	function sendMessage() {
		const text = textArea.value.trim();
		const model = modelSelector.value;

		if (text) {
			addMessage('user', text);
			vscode.postMessage({ type: 'sendMessage', text: text, model: model });
			textArea.value = '';
			textArea.style.height = 'auto';
			sendButton.disabled = true;
		}
	}

	function addMessage(role, text) {
		const div = document.createElement('div');
		div.className = `message ${role}`;

		// Simple markdown parsing for code blocks could go here,
		// but for now we'll just handle basic text and spacing.
		// In a real app, use a library like marked.js
		div.innerHTML = formatText(text);

		messagesContainer.appendChild(div);
		scrollToBottom();
	}

	function updateLastMessage(text) {
		const lastMessage = messagesContainer.lastElementChild;
		if (lastMessage && lastMessage.classList.contains('assistant')) {
			lastMessage.innerHTML = formatText(text);
			scrollToBottom();
		} else {
			addMessage('assistant', text);
		}
	}

	function scrollToBottom() {
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	function formatText(text) {
		// Very basic formatting
		return text
			.replace(/\n/g, '<br>')
			.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
			.replace(/`([^`]+)`/g, '<code>$1</code>');
	}
}());
