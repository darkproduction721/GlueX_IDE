from PIL import Image
import os

def convert_icons():
    source = r"C:\Users\Tony Cheung\.gemini\antigravity\brain\508e12d0-0577-416d-946c-4ff83f7f8ef7\gluex_logo.png"

    if not os.path.exists(source):
        print(f"Error: Source file not found: {source}")
        return

    try:
        img = Image.open(source)
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Windows ICO
    win_path = r"resources\win32\code.ico"
    try:
        # ICO requires specific sizes
        img.save(win_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
        print(f"Saved {win_path}")
    except Exception as e:
        print(f"Error saving ICO: {e}")

    # Linux PNG
    linux_path = r"resources\linux\code.png"
    try:
        # Linux usually expects 1024x1024 or similar, VS Code has specific pngs.
        # We will just save a high res png for now to where the main icon might be.
        # But 'resources/linux/code.png' needs to be checked if it exists contextually.
        # Just saving a generic one.
        img.save(linux_path)
        print(f"Saved {linux_path}")
    except Exception as e:
        print(f"Error saving Linux PNG: {e}")

    # Mac ICNS
    # Writing ICNS on Windows with Pillow is sometimes flaky or unsupported.
    mac_path = r"resources\darwin\Code.icns"
    try:
        img.save(mac_path, format='ICNS')
        print(f"Saved {mac_path}")
    except Exception as e:
        print(f"Warning: Could not save ICNS (Expected on Windows): {e}")

if __name__ == "__main__":
    convert_icons()
