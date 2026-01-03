
import shutil
import os

source_icon = r'd:\Projects\GlueXtest\resources\server\favicon.ico'

targets = [
    r'd:\Projects\GlueXtest\out\favicon.ico',
    r'd:\Projects\GlueXtest\out\vs\code\browser\workbench\favicon.ico',
    r'd:\Projects\GlueXtest\out\resources\server\favicon.ico'
]

if not os.path.exists(source_icon):
    print(f"Error: Source icon {source_icon} not found.")
    exit(1)

for target in targets:
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copy2(source_icon, target)
        print(f"Overwrote: {target}")
    except Exception as e:
        print(f"Failed to overwrite {target}: {e}")
