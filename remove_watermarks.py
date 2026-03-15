from PIL import Image, ImageFilter
import numpy as np
import os

BASE = 'public/images'

def fill_region(arr, x, y, w, h, src_x, src_y):
    """Fill region (x,y,w,h) with pixels sampled from (src_x,src_y,w,h)."""
    arr[y:y+h, x:x+w] = arr[src_y:src_y+h, src_x:src_x+w].copy()

def remove_sparkle(path):
    img = Image.open(path)
    rgba = img.mode == 'RGBA'
    arr = np.array(img)
    h, w = arr.shape[:2]
    # ✦ sparkle is ~30x30px in bottom-right corner
    pw = 40
    x = w - pw - 2
    y = h - pw - 2
    fill_region(arr, x, y, pw, pw, x - pw - 10, y)
    result = Image.fromarray(arr)
    result.save(path)
    print(f"  {os.path.basename(path)} ({w}x{h}): patched ({x},{y})")

def remove_mascot_artifacts(path):
    img = Image.open(path)
    arr = np.array(img)
    h, w = arr.shape[:2]
    print(f"  mascot ({w}x{h})")

    # Left kanji "棒": roughly x=215-300, y=295-385
    fill_region(arr, x=215, y=295, w=90, h=90, src_x=310, src_y=295)

    # Right kanji "榎": roughly x=490-575, y=65-155
    fill_region(arr, x=490, y=65, w=90, h=90, src_x=390, src_y=65)

    # Top-left gear icon: roughly x=130-195, y=140-200
    fill_region(arr, x=130, y=140, w=70, h=65, src_x=200, src_y=140)

    result = Image.fromarray(arr)
    result.save(path, quality=95)

for fname in ['curious.png','playful.png','proud.png','waving.png','yay.png','sad.png']:
    remove_sparkle(os.path.join(BASE, fname))

remove_mascot_artifacts(os.path.join(BASE, 'mascot.jpg'))
print("Done!")
