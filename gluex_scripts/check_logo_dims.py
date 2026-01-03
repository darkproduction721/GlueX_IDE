from PIL import Image
import os

folder = r'd:\Projects\GlueXtest\Logo'
files = ['inno-void.png', 'inno-void.bmp', 'inno-voidv2.bmp', 'favicon.ico']

for f in files:
    path = os.path.join(folder, f)
    if os.path.exists(path):
        try:
            img = Image.open(path)
            print(f"{f}: {img.size} {img.format}")
        except Exception as e:
            print(f"{f}: Error {e}")
    else:
        print(f"{f}: Not found")
