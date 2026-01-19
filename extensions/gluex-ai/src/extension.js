/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-unexternalized-strings */
const vscode = require("vscode");
const http = require("http");
const fs = require("fs");
const path = require("path");
const logPath = "C:\\Users\\Tony Cheung\\.gemini\\gluex_activation.log";

function log(msg) {
	try { fs.appendFileSync(logPath, msg + "\n"); } catch (e) { }
}

class GlueXModelProvider {
	constructor(vendorName) {
		this.vendorName = vendorName;
		this._onDidChangeLanguageModelChatInformation = new vscode.EventEmitter();
		log("Provider constructed: " + vendorName);
	}
	get onDidChangeLanguageModelChatInformation() {
		return this._onDidChangeLanguageModelChatInformation.event;
	}

	async provideLanguageModelChatInformation(token) {
		log("provideLanguageModelChatInformation called");
		// Return a robust model object to satisfy standard and shim requirements
		const model = {
			id: "deepseek-coder",
			name: "DeepSeek Coder",
			family: "gpt-3.5",
			version: "1.0",
			maxInputTokens: 4096,
			maxOutputTokens: 4096,
			isDefault: true,
			isUserSelectable: true,
			// SHIM: Required to prevent Core crash (TypeError: reading "editTools")
			metadata: {
				isUserSelectable: true,
				capabilities: {
					editTools: []
				}
			},
			// Legacy/Backup shims for compatibility
			extension: {
				editTools: [],
				identifier: { value: this.vendorName }
			},
			capabilities: { editTools: [] }
		};

		log("Returning model info");
		return [model];
	}

	async provideLanguageModelChatInfo(token) {
		return this.provideLanguageModelChatInformation(token);
	}

	async provideLanguageModelChatResponse(...args) {
		log("provideLanguageModelChatResponse CALLED (Constructor-Check)");

		const messages = args[0];
		let prompt = "Error";
		try {
			const msgs = args.find(a => Array.isArray(a));
			if (msgs) {
				const last = msgs[msgs.length - 1];
				prompt = typeof last.content === "string" ? last.content : last.content.map(c => c.value).join("");
			}
		} catch (e) { log("Prompt extraction error: " + e); }
		log("Prompt: " + prompt);

		// Define the Async Iterable
		const asyncIterable = {
			async *[Symbol.asyncIterator]() {
				log("AsyncIterator: STARTED");
				yield new vscode.LanguageModelTextPart("...Thinking (Iterator)...");

				const requestData = JSON.stringify({
					model: "deepseek-coder:latest",
					messages: [{ role: "user", content: prompt }],
					stream: false
				});

				let responseText = "Error";
				try {
					responseText = await new Promise((resolve, reject) => {
						const req = http.request({
							hostname: "127.0.0.1", port: 11434, path: "/api/chat", method: "POST",
							headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(requestData) },
							timeout: 20000
						}, (res) => {
							let body = "";
							res.on("data", c => body += c);
							res.on("end", () => {
								try {
									const parsed = JSON.parse(body);
									if (parsed.error) {
										resolve("Ollama Error: " + parsed.error);
									} else {
										resolve(parsed.message?.content || "No response");
									}
								} catch (e) { resolve("Parse Error: " + e.message); }
							});
						});
						req.on("error", e => resolve("Net Error: " + e.message));
						req.on("timeout", () => { req.destroy(); resolve("Timeout"); });
						req.write(requestData);
						req.end();
					});
				} catch (e) { responseText = "Exception: " + e.message; }

				log("AsyncIterator: Yielding result");
				yield new vscode.LanguageModelTextPart(responseText);
				log("AsyncIterator: DONE");
			}
		};

		// Check and use Constructor if possible
		if (vscode.LanguageModelChatResponse) {
			log("Using vscode.LanguageModelChatResponse Constructor");
			try {
				return new vscode.LanguageModelChatResponse(asyncIterable);
			} catch (e) {
				log("Constructor Failed: " + e + ". Falling back to plain object");
				return { stream: asyncIterable };
			}
		}

		log("Returning plain object { stream }");
		return { stream: asyncIterable };
	}
}

async function activate(context) {
	log("Activation started at " + new Date().toISOString());
	const uniqueVendor = "gluex-local";
	log("Vendor: " + uniqueVendor);

	try {
		if (!vscode.chat) {
			log("vscode.chat is UNDEFINED. Proposed API not available? check product.json/package.json");
		} else {
			log("vscode.chat is defined");
		}

		if (vscode.lm && vscode.lm.registerLanguageModelChatProvider) {
			try {
				context.subscriptions.push(vscode.lm.registerLanguageModelChatProvider(uniqueVendor, new GlueXModelProvider(uniqueVendor)));
				log("Registered LM provider");
			} catch (e) { log("Failed to register provider: " + e.message); }
		}

		if (vscode.chat && vscode.chat.createChatParticipant) {
			const handler = async (request, context, stream, token) => {
				log("Handler received request: " + request.prompt);
				try {
					stream.progress("Gathering Context...");

					// --- CONTEXT GATHERING START ---
					let contextMsg = "";

					// 1. Active Text Editor (Implicit Context)
					const activeEditor = vscode.window.activeTextEditor;
					if (activeEditor && activeEditor.document.uri.scheme === "file") {
						const content = activeEditor.document.getText();
						// Limit explicit active file size
						const truncated = content.length > 10000 ? content.substring(0, 10000) + "\n...[TRUNCATED]..." : content;
						contextMsg += `\n[ACTIVE FILE: ${path.basename(activeEditor.document.fileName)}]\n\`\`\`\n${truncated}\n\`\`\`\n`;
					}

					// 2. Explicit References (e.g. pinned files or selections)
					if (request.references && request.references.length > 0) {
						for (const ref of request.references) {
							if (ref.value instanceof vscode.Uri || (ref.id && ref.id.startsWith && ref.id.startsWith("vscode.uri"))) {
								const uri = ref.value instanceof vscode.Uri ? ref.value : ref.value.uri;
								try {
									const doc = await vscode.workspace.openTextDocument(uri);
									const content = doc.getText();
									// Limit reference size
									const truncated = content.length > 10000 ? content.substring(0, 10000) + "\n...[TRUNCATED]..." : content;
									contextMsg += `\n[REFERENCE: ${path.basename(uri.fsPath)}]\n\`\`\`\n${truncated}\n\`\`\`\n`;
								} catch (e) {
									log(`Failed to read reference ${uri}: ${e}`);
								}
							}
						}
					}

					// 3. Workspace Structure (Triggered by broad keywords)
					const promptLower = request.prompt.toLowerCase();
					const accessKeywords = ["folder", "project", "workspace", "files", "structure", "read", "see", "what"];

					log(`Check keywords for: "${promptLower}"`);
					// If any keyword is present, scan the workspace.
					if (accessKeywords.some(k => promptLower.includes(k))) {
						log("Keyword match! Scanning workspace...");
						stream.progress("Scanning Workspace...");

						// INJECT ABSOLUTE PATH
						if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
							const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
							contextMsg += `\n[ACTIVE WORKSPACE PATH: ${rootPath}]\n`;
							log("Injecting workspace path: " + rootPath);
						} else {
							log("No workspace folders found.");
						}

						try {
							const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**", 500); // Limit to 500 files
							log(`Found ${files.length} files.`);
							const fileList = files.map(f => vscode.workspace.asRelativePath(f)).join("\n");
							contextMsg += `\n[WORKSPACE FILES]\n${fileList}\n`;
						} catch (err) {
							log("Error finding files: " + err);
						}
					} else {
						log("No keyword match.");
					}
					// --- CONTEXT GATHERING END ---

					stream.progress("Connecting to Brain...");

					// Build conversation history from context
					const ollamaMessages = [];

					// System Prompt / Context Injection
					let systemPrompt = "You are GlueX, an intelligent coding assistant inside VS Code. You can read files and folders provided in the Context Information. DO NOT say you cannot access files. Always answer based on the provided context.";
					if (contextMsg) {
						systemPrompt += "\n\nCONTEXT INFORMATION:\n" + contextMsg + "\n\nUse the above context to answer the user's request. If the user asks what is in the folder, list the files from [WORKSPACE FILES].";
						log("Context injected into System Prompt. Size: " + contextMsg.length);
					}
					ollamaMessages.push({ role: "system", content: systemPrompt });

					// 1. Add History
					if (context.history) {
						/* eslint-disable local/code-no-unexternalized-strings */
						for (const turn of context.history) {
							if (turn.prompt) {
								ollamaMessages.push({ role: "user", content: turn.prompt });
							}
							if (turn.response) {
								// response is an array of ChatResponsePart
								const text = turn.response
									.map(p => {
										if (typeof p.value === "string") { return p.value; }
										if (p.value && typeof p.value.value === "string") { return p.value.value; } // MarkdownString
										return "";
									})
									.join("");

								if (text) {
									ollamaMessages.push({ role: "assistant", content: text });
								}
							}
						}
					}

					// 2. Add Current Prompt (With Reinforcement)
					let finalUserPrompt = request.prompt;
					if (contextMsg) {
						finalUserPrompt += "\n\n(Note: Workspace files and content have been provided in the System Prompt Context. Please use them!)";
					}
					ollamaMessages.push({ role: "user", content: finalUserPrompt });

					log("Sending " + ollamaMessages.length + " messages to Ollama");

					// DIRECT OLLAMA CALL
					const requestData = JSON.stringify({
						model: "deepseek-coder:latest",
						messages: ollamaMessages,
						stream: true
					});

					await new Promise((resolve, reject) => {
						const req = http.request({
							hostname: "127.0.0.1", port: 11434, path: "/api/chat", method: "POST",
							headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(requestData) },
							timeout: 60000
						}, (res) => {
							res.setEncoding("utf8");
							let buffer = "";

							res.on("data", (chunk) => {
								buffer += chunk;
								const lines = buffer.split("\n");
								buffer = lines.pop();

								for (const line of lines) {
									if (!line.trim()) {
										continue;
									}
									try {
										const parsed = JSON.parse(line);
										if (parsed.message && parsed.message.content) {
											stream.markdown(parsed.message.content);
										}
										if (parsed.error) {
											stream.markdown(`\n*Ollama Error: ${parsed.error}*`);
										}
									} catch (e) { }
								}
							});

							res.on("end", () => {
								log("Direct Ollama Stream Finished");
								resolve();
							});
						});

						req.on("error", (e) => {
							stream.markdown(`\n*Connection Error: ${e.message}*`);
							log("Direct Ollama Connection Error: " + e.message);
							resolve();
						});

						req.on("timeout", () => {
							req.destroy();
							stream.markdown(`\n*Connection Timeout*`);
							resolve();
						});

						req.write(requestData);
						req.end();
					});


				} catch (e) {
					stream.markdown(`**Exception:** ${e.message}`);
					log("Handler Exception: " + e.message);
				}
			};

			const chatParticipant = vscode.chat.createChatParticipant("gluex.chat", handler);
			chatParticipant.iconPath = new vscode.ThemeIcon("hubot");
			context.subscriptions.push(chatParticipant);
			log("Registered chat participant gluex.chat");
		} else {
			log("ABORTING: vscode.chat.createChatParticipant is missing.");
		}
	} catch (err) {
		log("CRITICAL ACTIVATION ERROR: " + err.message + "\n" + err.stack);
	}
}

function deactivate() { }

module.exports = { activate, deactivate };
