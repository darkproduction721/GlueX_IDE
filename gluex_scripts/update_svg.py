import base64
import os

png_path = r'd:\Projects\GlueXtest\Logo\inno-void.png'
targets = [
    r'd:\Projects\GlueXtest\src\vs\workbench\browser\media\code-icon.svg',
    r'd:\Projects\GlueXtest\src\vs\workbench\contrib\welcomeGettingStarted\common\media\vscode.svg',
    r'd:\Projects\GlueXtest\src\vs\workbench\browser\parts\editor\media\letterpress.svg',
    r'd:\Projects\GlueXtest\src\vs\workbench\browser\parts\editor\media\letterpress-dark.svg',
    r'd:\Projects\GlueXtest\src\vs\workbench\browser\parts\editor\media\letterpress-hcDark.svg',
    r'd:\Projects\GlueXtest\src\vs\workbench\browser\parts\editor\media\letterpress-hcLight.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\browser\media\code-icon.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\contrib\welcomeGettingStarted\common\media\vscode.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\browser\parts\editor\media\letterpress.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\browser\parts\editor\media\letterpress-dark.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\browser\parts\editor\media\letterpress-hcDark.svg',
    r'd:\Projects\GlueXtest\out\vs\workbench\browser\parts\editor\media\letterpress-hcLight.svg'
]

if not os.path.exists(png_path):
    print(f"Error: {png_path} not found.")
    exit(1)

with open(png_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <image width="512" height="512" href="data:image/png;base64,{encoded_string}"/>
</svg>'''

for target in targets:
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, "w") as f:
            f.write(svg_content)
        print(f"Updated: {target}")
    except Exception as e:
        print(f"Failed to update {target}: {e}")
