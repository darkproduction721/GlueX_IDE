
import os

files_to_patch = [
    r'd:\Projects\GlueXtest\out\vs\workbench\workbench.web.main.js',
    r'd:\Projects\GlueXtest\out\vs\workbench\contrib\welcomeGettingStarted\browser\gettingStarted.nls.json'
]

replacements = {
    '"Code - OSS Dev"': '"GlueX"',
    "'Code - OSS Dev'": "'GlueX'",
    '"code-oss"': '"gluex"',
    "'code-oss'": "'gluex'",
    '"Code - OSS"': '"GlueX"',
    "'Code - OSS'": "'GlueX'",
    '"VS Code"': '"GlueX"',
    "'VS Code'": "'GlueX'",
    '"Visual Studio Code"': '"GlueX"',
    "'Visual Studio Code'": "'GlueX'",
    'Get Started with VS Code': 'Get Started with GlueX',
    'VS Code for the Web': 'GlueX for the Web'
}

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (not found)")
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Successfully patched {os.path.basename(file_path)}")
        else:
            print(f"No changes needed for {os.path.basename(file_path)}")

    except Exception as e:
        print(f"Error patching {file_path}: {e}")
