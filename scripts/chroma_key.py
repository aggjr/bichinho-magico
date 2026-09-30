"""Remove green-screen backgrounds from generated character art.

Keys by distance to the sampled background colour (not "any green"), so
green-skinned characters like the dinosaur survive. Green spill is removed
only in a thin band along the silhouette edge.

Usage: python scripts/chroma_key.py <input.png> <output.webp> [max_size]
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def sample_bg(a: np.ndarray) -> np.ndarray:
    h, w, _ = a.shape
    s = max(8, min(h, w) // 40)
    corners = [a[:s, :s], a[:s, -s:], a[-s:, :s], a[-s:, -s:]]
    return np.median(np.concatenate([c.reshape(-1, 3) for c in corners]), axis=0)


def key(src: str, dst: str, max_size: int = 768) -> None:
    img = Image.open(src).convert("RGB")
    a = np.asarray(img).astype(np.float32) / 255.0
    bg = sample_bg(a)
    # Magenta/pink chroma → convert to green so green-skinned pets (slime) can key safely
    if float(bg[0]) > 0.55 and float(bg[2]) > 0.55 and float(bg[1]) < 0.45:
        r0, g0, b0 = a[..., 0], a[..., 1], a[..., 2]
        mag = (r0 > 0.55) & (b0 > 0.55) & (g0 < np.maximum(r0, b0) * 0.75)
        a = a.copy()
        a[mag] = (0.0, 1.0, 0.0)
        bg = sample_bg(a)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]

    dist = np.sqrt(((a - bg) ** 2).sum(axis=-1))
    greenness = g - np.maximum(r, b)
    bg_green = float(bg[1] - max(bg[0], bg[2]))

    # Pixel is background if it is close to the key colour AND strongly green.
    bgness = np.clip((0.42 - dist) / 0.26, 0, 1) * np.clip((greenness - 0.1) / max(bg_green * 0.5, 0.1), 0, 1)
    alpha = 1.0 - bgness

    solid = alpha > 0.5
    solid = ndimage.binary_opening(solid, iterations=2)
    labels, count = ndimage.label(solid)
    if count > 1:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        keep = np.zeros(count + 1, bool)
        keep[1:] = sizes >= max(sizes.max() * 0.02, 400)
        solid = keep[labels]

    # Erode to cut off the fringe, then soften.
    core = ndimage.binary_erosion(solid, iterations=3)
    soft = ndimage.gaussian_filter(core.astype(np.float32), 1.4)
    alpha = np.clip(np.minimum(alpha, soft * 1.25), 0, 1)

    # Despill inside a band near the edge.
    band = (ndimage.binary_dilation(~core, iterations=18) & core) | (alpha < 0.99)

    # For non-green characters, olive fringe pixels on the edge are background spill.
    hsv = np.asarray(img.convert("HSV")).astype(np.float32)
    hue, sat = hsv[..., 0], hsv[..., 1]
    inner = core & ~band
    if inner.any():
        core_hue = float(np.median(hue[inner]))
        if 40 <= core_hue <= 125:
            band = (ndimage.binary_dilation(~core, iterations=3) & core) | (alpha < 0.99)
        else:
            olive = band & (hue >= 38) & (hue <= 125) & (sat > 50)
            kill = ndimage.gaussian_filter(olive.astype(np.float32), 1.0)
            alpha = alpha * (1 - np.clip(kill * 1.6, 0, 1))
    limit = np.maximum(r, b)
    # Warm characters (fur is red/orange) tolerate a hard clamp; keep a little green otherwise.
    g2 = np.where(band & (g > limit), limit + (g - limit) * 0.05, g)
    out = np.stack([r, g2, b, alpha], axis=-1)

    im = Image.fromarray((out * 255).astype(np.uint8), "RGBA")
    bbox = im.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox()
    if bbox:
        pad = 10
        w, h = im.size
        im = im.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad)))

    im.thumbnail((max_size, max_size), Image.LANCZOS)
    im.save(dst, "WEBP", quality=90, method=6)


if __name__ == "__main__":
    key(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 768)
