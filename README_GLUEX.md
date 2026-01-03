# GlueX.ai - Build Instructions

Welcome to the **GlueX.ai** source code. This is a custom IDE based on VS Code, tailored for your team with built-in AI capabilities.

## 🚀 Features Added
1.  **Branding**:
    *   Name: **GlueX** / **GlueX.ai**
    *   Executable: `gluex` (Windows), `GlueX` (Mac)
    *   Icons: Custom GlueX Logo applied.
2.  **AI Integration (`extensions/gluex-ai`)**:
    *   **Local LLM**: Integrated with Ollama (deepseek-coder:7b).
    *   **Cloud LLM**: Integrated with SiliconFlow API.
    *   **Chat Interface**: accessible via the Activity Bar.

## 🛠️ Build Prerequisites
To build GlueX from source, you need a specific toolchain.
Reference: [VS Code Build Wiki](https://github.com/microsoft/vscode/wiki/How-to-Contribute)

> [!WARNING]
> **Path Restriction**: Do not clone this repository into a folder with spaces in the name (e.g., `GlueX test`). The build scripts for native modules will fail. Use `GlueX` or `gluex-dev` instead.

### Windows
1.  **Node.js**: Version 20.x or 22.x.
2.  **Python**: Version 3.x.
3.  **C++ Build Tools**: Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) (Select "Desktop development with C++").
    > **Tip**: You can run `powershell .\setup_environment.ps1` to try installing these automatically.
4.  **Yarn/NPM**: We use `npm` in this repo now.

### macOS (For your iMac)
1.  **Xcode**: Install Xcode and Command Line Tools.
2.  **Node.js**: Same as above.
3.  **Python**.

## 🏗️ How to Build
1.  **Install Dependencies**:
    ```bash
    npm install
    # If network issues in HK, ensure you have a proxy or VPN configured.
    ```

2.  **Run in Dev Mode**:
    ```bash
    # Windows
    .\scripts\code.bat

    # macOS
    ./scripts/code.sh
    ```
    This will compile the sources and launch the "GlueX" (OSS) window. You should see the GlueX logo and the "GlueX AI" extension in the sidebar.

3.  **Build Release Binary**:
    ```bash
    # Windows (Generates .zip or installer)
    npx gulp vscode-win32-x64

    # macOS (Generates .app)
    npx gulp vscode-darwin-x64 (or arm64 for M1/M2/M3)
    ```

## 🧠 AI Configuration
Once running:
1.  Go to **Activity Bar > GlueX AI**.
2.  Type a message to test Local LLM ( Ensure Ollama is running at `localhost:11434` ).
3.  To use Cloud LLM:
    - Open **Settings** (`Ctrl+,`).
    - Search for `GlueX`.
    - Set `Provider` to `cloud`.
    - Enter your **SiliconFlow API Key**.
