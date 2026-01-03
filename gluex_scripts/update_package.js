const fs = require('fs');
const content = {
    "name": "gluex-ai",
    "displayName": "Vibe Coding",
    "description": "Vibe Coding with Local LLM and Claude",
    "version": "0.0.1",
    "publisher": "GlueX",
    "engines": {
        "vscode": "^1.85.0"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/GlueX/gluex-ai.git"
    },
    "main": "./src/extension.js",
    "activationEvents": [
        "*"
    ],
    "enabledApiProposals": [
        "chatParticipant",
        "chatParticipantAdditions",
        "chatParticipantPrivate",
        "defaultChatParticipant",
        "chatVariable",
        "chatProvider"
    ],
    "contributes": {
        "viewsContainers": {
            "activitybar": [
                {
                    "id": "gluex-ai",
                    "title": "GlueX AI",
                    "icon": "$(hubot)"
                }
            ]
        },
        "views": {
            "gluex-ai": [
                {
                    "id": "gluex.ai.chatView",
                    "name": "Chat"
                }
            ]
        },
        "commands": [
            {
                "command": "gluex.ai.openSettings",
                "title": "GlueX AI Settings"
            }
        ],
        "configuration": {
            "title": "GlueX AI",
            "properties": {
                "gluex.ai.provider": {
                    "type": "string",
                    "enum": [
                        "local",
                        "cloud"
                    ],
                    "default": "local",
                    "description": "Select AI Provider: Local (Ollama) or Cloud (SiliconFlow)"
                },
                "gluex.ai.cloudApiKey": {
                    "type": "string",
                    "default": "",
                    "description": "API Key for SiliconFlow (Cloud Provider)"
                },
                "gluex.ai.localUrl": {
                    "type": "string",
                    "default": "http://localhost:11434",
                    "description": "URL for Local Provider (Ollama)"
                },
                "gluex.ai.model": {
                    "type": "string",
                    "default": "deepseek-coder:7b",
                    "description": "Model name to use with Ollama"
                }
            }
        },
        "chatParticipants": [
            {
                "id": "gluex.ai.chatParticipant",
                "name": "gluex",
                "fullName": "GlueX AI",
                "description": "GlueX AI Assistant (Ollama)",
                "isDefault": true
            }
        ]
    }
};
fs.writeFileSync('d:\\Projects\\GlueXtest\\extensions\\gluex-ai\\package.json', JSON.stringify(content, null, 4));
console.log('Successfully wrote package.json');
