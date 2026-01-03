import os
from PIL import Image
import glob

SOURCE_LOGO = r'd:\Projects\GlueXtest\Logo\inno-void.bmp'
TARGET_DIR = r'd:\Projects\GlueXtest\resources\win32'

def update_bitmaps():
    if not os.path.exists(SOURCE_LOGO):
        print(f"Error: Source logo not found at {SOURCE_LOGO}")
        return

    logo = Image.open(SOURCE_LOGO).convert("RGBA")

    bmp_files = glob.glob(os.path.join(TARGET_DIR, 'inno-*.bmp'))

    print(f"Found {len(bmp_files)} BMP files to update.")

    for bmp_path in bmp_files:
        try:
            # Read dimensions of existing file
            with Image.open(bmp_path) as existing:
                width, height = existing.size

            # Create new white background
            new_img = Image.new('RGB', (width, height), (255, 255, 255))

            # Determine logo sizing strategy
            # For 'big' sidebar: usually header style or centered.
            # For 'small' header: usually centered.

            filename = os.path.basename(bmp_path)

            if 'big' in filename:
                # Sidebar logic: Place logo in top portion, maybe 80% width
                target_w = int(width * 0.8)
                ratio = target_w / logo.width
                target_h = int(logo.height * ratio)

                # Resize logo
                resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

                # Paste at top center (with some padding)
                x_pos = (width - target_w) // 2
                y_pos = int(height * 0.1) # 10% from top

            else:
                # Small header logic: Fit within, maybe 90%
                padding = 4
                target_h = height - (padding * 2)
                ratio = target_h / logo.height
                target_w = int(logo.width * ratio)

                if target_w > width - (padding * 2):
                    target_w = width - (padding * 2)
                    ratio = target_w / logo.width
                    target_h = int(logo.height * ratio)

                resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

                # Paste centered
                x_pos = (width - target_w) // 2
                y_pos = (height - target_h) // 2

            # Paste (using alpha channel as mask)
            new_img.paste(resized_logo, (x_pos, y_pos), resized_logo)

            # Save
            new_img.save(bmp_path)
            print(f"Updated {filename} ({width}x{height})")

        except Exception as e:
            print(f"Failed to update {bmp_path}: {e}")

if __name__ == '__main__':
    update_bitmaps()
