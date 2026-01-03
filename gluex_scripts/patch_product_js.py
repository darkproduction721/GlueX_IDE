
import os

product_js_path = r'd:\Projects\GlueXtest\out\vs\platform\product\common\product.js'

if not os.path.exists(product_js_path):
    print(f"Error: {product_js_path} not found.")
    exit(1)

with open(product_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "nameShort: 'Code - OSS Dev'": "nameShort: 'GlueX'",
    "nameLong: 'Code - OSS Dev'": "nameLong: 'GlueX.ai'",
    "applicationName: 'code-oss'": "applicationName: 'gluex'",
    "dataFolderName: '.vscode-oss'": "dataFolderName: '.gluex-ai'",
    "urlProtocol: 'code-oss'": "urlProtocol: 'gluex'"
}

new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)

if new_content != content:
    with open(product_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched product.js")
else:
    print("No changes needed or strings not found.")
