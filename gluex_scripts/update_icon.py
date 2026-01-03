from PIL import Image
import os

source_path = r'd:\Projects\GlueXtest\Logo\inno-void.png'
destinations = [
    (r'd:\Projects\GlueXtest\resources\win32\code.ico', [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]),
    (r'd:\Projects\GlueXtest\resources\server\favicon.ico', [(16, 16), (32, 32), (48, 48)]),
    (r'd:\Projects\GlueXtest\resources\server\code-192.png', [(192, 192)]),
    (r'd:\Projects\GlueXtest\resources\server\code-512.png', [(512, 512)])
]

if not os.path.exists(source_path):
    print(f"Error: {source_path} not found.")
    exit(1)

img = Image.open(source_path)

for dest_path, sizes in destinations:
    try:
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        if dest_path.endswith('.ico'):
            img.save(dest_path, sizes=sizes)
            print(f"Updated ICO: {dest_path}")
        else:
            # For PNGs, assume single size or resize to first size
            resized_img = img.resize(sizes[0])
            resized_img.save(dest_path)
            print(f"Updated PNG: {dest_path}")
    except Exception as e:
        print(f"Failed to update {dest_path}: {e}")
