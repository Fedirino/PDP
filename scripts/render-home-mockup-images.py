from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / "mockup-images"
out.mkdir(exist_ok=True)

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 24)
    font = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
    font_hero = ImageFont.truetype("arialbd.ttf", 31)
except Exception:
    font_bold = font = font_small = font_tiny = font_hero = ImageFont.load_default()


def hexrgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def gradient(draw, box, c1, c2, c3=None):
    x0, y0, x1, y1 = box
    h = y1 - y0
    for y in range(y0, y1):
        t = (y - y0) / max(1, h - 1)
        if c3 and t > .55:
            c = mix(c2, c3, (t - .55) / .45)
        else:
            c = mix(c1, c2, t / .55 if c3 else t)
        draw.line((x0, y, x1, y), fill=c)


def rr(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_icon(draw, kind, cx, cy, color):
    if kind == "search":
        draw.ellipse((cx - 9, cy - 9, cx + 5, cy + 5), outline=color, width=3)
        draw.line((cx + 4, cy + 4, cx + 12, cy + 12), fill=color, width=3)
    elif kind == "list":
        for i in range(3):
            draw.line((cx - 8, cy - 8 + i * 8, cx + 12, cy - 8 + i * 8), fill=color, width=3)
            draw.ellipse((cx - 16, cy - 10 + i * 8, cx - 12, cy - 6 + i * 8), fill=color)
    elif kind == "cal":
        draw.rounded_rectangle((cx - 14, cy - 13, cx + 14, cy + 13), radius=4, outline=color, width=3)
        draw.line((cx - 14, cy - 5, cx + 14, cy - 5), fill=color, width=3)
        draw.line((cx - 7, cy - 17, cx - 7, cy - 9), fill=color, width=3)
        draw.line((cx + 7, cy - 17, cx + 7, cy - 9), fill=color, width=3)
    elif kind == "folder":
        draw.line((cx - 15, cy - 8, cx - 4, cy - 8, cx, cy - 3, cx + 15, cy - 3, cx + 15, cy + 11, cx - 15, cy + 11, cx - 15, cy - 8), fill=color, width=3)
    elif kind == "house":
        draw.polygon([(cx - 12, cy), (cx, cy - 11), (cx + 12, cy)], outline=color)
        draw.rectangle((cx - 8, cy, cx + 8, cy + 10), outline=color, width=2)
    else:
        draw.line((cx - 13, cy + 11, cx + 9, cy - 11), fill=color, width=3)
        draw.ellipse((cx - 15, cy + 9, cx - 9, cy + 15), outline=color, width=3)
        draw.ellipse((cx + 7, cy - 15, cx + 13, cy - 9), outline=color, width=3)


def draw_phone(palette):
    w, h = 328, 688
    bg = hexrgb(palette["bg"])
    surface = hexrgb(palette["surface"])
    surface2 = hexrgb(palette["surface2"])
    ink = hexrgb(palette["ink"])
    ink2 = hexrgb(palette["ink2"])
    ink3 = hexrgb(palette["ink3"])
    line = hexrgb(palette["line"])
    line2 = hexrgb(palette["line2"])
    brand = hexrgb(palette["brand"])
    brandink = hexrgb(palette["brandink"])
    tint = hexrgb(palette["tint"])
    heroink = hexrgb(palette["heroink"])

    im = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(im)
    for radius, alpha in [(250, .08), (180, .10), (110, .12)]:
        draw.ellipse((w // 2 - radius, -180 - radius, w // 2 + radius, -180 + radius), fill=mix(bg, brand, alpha))
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=34, outline=mix(line2, ink3, .25), width=1)

    draw.rectangle((0, 0, w, 66), fill=mix(bg, surface, .18))
    draw.line((0, 65, w, 65), fill=line)
    rr(draw, (14, 14, 51, 51), 10, tint)
    draw.text((23, 21), "P", font=font_bold, fill=brandink)
    draw.text((62, 22), "PDP", font=font_bold, fill=ink)
    rr(draw, (278, 15, 313, 50), 18, surface2, outline=line2)
    draw.text((286, 25), "PD", font=font_tiny, fill=brandink)

    x, y, hw, hh = 14, 82, 300, 202
    c1, c2, c3 = [hexrgb(c) for c in palette["hero"]]
    mask = Image.new("L", (hw, hh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, hw, hh), radius=22, fill=255)
    hero = Image.new("RGB", (hw, hh), c1)
    gradient(ImageDraw.Draw(hero), (0, 0, hw, hh), c1, c2, c3)
    im.paste(hero, (x, y), mask)
    draw.rounded_rectangle((x, y, x + hw, y + hh), radius=22, outline=mix(heroink, c2, .62), width=1)
    rr(draw, (32, 109, 74, 151), 12, mix(c2, brand, .35))
    draw.text((45, 118), "P", font=font_bold, fill=heroink)
    draw.text((84, 111), "PRODUCE", font=font_tiny, fill=mix(heroink, c2, .35))
    draw.text((84, 126), "Good", font=font_hero, fill=heroink)
    draw.text((84, 153), "morning", font=font_hero, fill=heroink)
    draw.text((32, 181), "Saturday, September 12 - 8:42 AM", font=font_small, fill=mix(heroink, c2, .25))
    draw.line((184, 106, 184, 174), fill=mix(heroink, c2, .55), width=1)
    draw.text((196, 109), "DID YOU KNOW?", font=font_tiny, fill=brandink)
    draw.multiline_text((196, 130), "Crisp greens keep\ntheir texture best\nwhen rotated often.", font=font_small, fill=mix(heroink, c2, .20), spacing=2)
    panel = mix(c1, bg, .30)
    rr(draw, (32, 202, 201, 257), 14, panel, outline=mix(heroink, c2, .60))
    draw.text((44, 214), "NEXT IN - AM", font=font_tiny, fill=mix(heroink, c2, .32))
    draw.text((44, 231), "Jordan - 9:00", font=font, fill=heroink)
    rr(draw, (166, 215, 192, 244), 9, mix(heroink, c2, .85))
    draw.text((174, 220), ">", font=font_bold, fill=heroink)
    rr(draw, (208, 202, 296, 257), 14, panel, outline=mix(heroink, c2, .60))
    draw.text((220, 214), "LIST", font=font_tiny, fill=mix(heroink, c2, .32))
    draw.text((220, 231), "18 left", font=font, fill=heroink)

    draw.text((18, 307), "TODAY", font=font_tiny, fill=ink3)
    rr(draw, (14, 329, 314, 389), 15, surface, outline=line2)
    rr(draw, (29, 340, 66, 377), 10, tint)
    draw.text((39, 348), "OK", font=font_tiny, fill=brand)
    draw.text((80, 343), "Daily Checklist", font=font, fill=ink)
    draw.text((80, 365), "5 of 11 done today", font=font_tiny, fill=ink2)
    draw.text((293, 348), ">", font=font_bold, fill=ink3)

    draw.text((18, 421), "QUICK ACCESS", font=font_tiny, fill=ink3)
    tiles = [
        ("Stencil", "search", tint, brandink),
        ("List", "list", hexrgb(palette["citrustint"]), hexrgb(palette["citrus"])),
        ("Schedule", "cal", hexrgb(palette["skytint"]), hexrgb(palette["sky"])),
        ("Documents", "folder", hexrgb(palette["violettint"]), hexrgb(palette["violet"])),
    ]
    coords = [(14, 443, 154, 536), (164, 443, 314, 536), (14, 545, 154, 638), (164, 545, 314, 638)]
    for (name, kind, chip_fill, chip_ink), box in zip(tiles, coords):
        rr(draw, box, 15, surface, outline=line)
        rr(draw, (box[0] + 14, box[1] + 13, box[0] + 52, box[1] + 51), 12, chip_fill)
        draw_icon(draw, kind, box[0] + 33, box[1] + 32, chip_ink)
        draw.text((box[0] + 14, box[3] - 31), name, font=font_bold, fill=ink)
    draw.text((132, 645), "PDP v5.69.0", font=font_tiny, fill=ink3)

    draw.rectangle((0, 620, w, h), fill=mix(bg, surface, .14))
    draw.line((0, 620, w, 620), fill=line)
    tabs = [("Home", "house"), ("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Tools", "tools")]
    for i, (label, kind) in enumerate(tabs):
        cx = 33 + i * 65
        if i == 0:
            rr(draw, (cx - 19, 628, cx + 19, 653), 13, tint)
            color = brandink
        else:
            color = ink3
        draw_icon(draw, kind, cx, 641, color)
        draw.text((cx - len(label) * 3, 660), label, font=font_tiny, fill=color)
    return im


palettes = [
    ("Studio Market", "current", dict(bg="#0c1016", surface="#151b23", surface2="#1b2430", ink="#f1f5f4", ink2="#b6c1c2", ink3="#778589", line="#242e39", line2="#344352", brand="#55d9ad", brandink="#72e5bd", tint="#15342f", hero=["#1c3037", "#173f3d", "#166050"], heroink="#ecf7ef", amber="#ffa028", ambertint="#2e2110", citrus="#ffc63a", citrustint="#2e2610", sky="#4db8e8", skytint="#11242e", violet="#9b8cff", violettint="#1c1930")),
    ("Fresh Daylight", "light", dict(bg="#f5f8f4", surface="#ffffff", surface2="#edf4ef", ink="#15231e", ink2="#506159", ink3="#7e8d85", line="#d8e3dd", line2="#c3d4cb", brand="#268f62", brandink="#176b49", tint="#dff2e8", hero=["#e8f7ec", "#c8ead8", "#6ec39a"], heroink="#14251e", amber="#b76a00", ambertint="#fff0d6", citrus="#987400", citrustint="#fff5cf", sky="#247da8", skytint="#dff0f8", violet="#6b5fd6", violettint="#e8e5ff")),
    ("Harvest Counter", "warm", dict(bg="#15110e", surface="#211a15", surface2="#2a221b", ink="#fff8ed", ink2="#d5c5ae", ink3="#988871", line="#352a21", line2="#4a392b", brand="#f2b85b", brandink="#ffd089", tint="#3a2815", hero=["#402b18", "#6a3722", "#9c6231"], heroink="#fff7e8", amber="#f2b85b", ambertint="#3a2815", citrus="#d6de66", citrustint="#303215", sky="#74c7d5", skytint="#183036", violet="#c8a8ff", violettint="#2b223d")),
    ("Cooler Shift", "blue", dict(bg="#07151c", surface="#10242d", surface2="#17313b", ink="#edf8fb", ink2="#b4cbd3", ink3="#71909a", line="#1d3944", line2="#2d5361", brand="#65d4f0", brandink="#8ce5f7", tint="#113844", hero=["#133844", "#16546b", "#278a98"], heroink="#effbff", amber="#ffc05b", ambertint="#372914", citrus="#b6e36f", citrustint="#263318", sky="#65d4f0", skytint="#113844", violet="#a9a3ff", violettint="#222144")),
    ("Ink & Citrus", "contrast", dict(bg="#111318", surface="#1b1e25", surface2="#232832", ink="#f6f7ef", ink2="#c6c8bd", ink3="#858a80", line="#2d323c", line2="#444b58", brand="#d9f05f", brandink="#e4f77a", tint="#303718", hero=["#252a24", "#444b22", "#92a337"], heroink="#fbffe8", amber="#f1b950", ambertint="#332712", citrus="#d9f05f", citrustint="#303718", sky="#6bbbe4", skytint="#172a35", violet="#b096ff", violettint="#27203d")),
    ("Soft Plum", "alt", dict(bg="#18141b", surface="#231d28", surface2="#2b2432", ink="#faf4ff", ink2="#d3c4dc", ink3="#927f9e", line="#332a3b", line2="#4b3c58", brand="#ee90b8", brandink="#ffadc9", tint="#3a2230", hero=["#33223c", "#593153", "#934a6e"], heroink="#fff4fb", amber="#f1bf63", ambertint="#352814", citrus="#c8dc6f", citrustint="#2d3218", sky="#75c6dc", skytint="#18303a", violet="#b7a1ff", violettint="#28223f")),
]

phones = []
for name, tag, palette in palettes:
    image = draw_phone(palette)
    image.save(out / f"pdp-home-{tag}.png")
    phones.append((name, tag, image))

cell_w, cell_h = 390, 790
board = Image.new("RGB", (cell_w * 3, cell_h * 2), (232, 237, 241))
draw = ImageDraw.Draw(board)
for index, (name, tag, image) in enumerate(phones):
    col = index % 3
    row = index // 3
    ox = col * cell_w
    oy = row * cell_h
    draw.text((ox + 32, oy + 24), name, font=font_bold, fill=(23, 32, 39))
    draw.text((ox + 32, oy + 55), tag.upper(), font=font_tiny, fill=(98, 112, 125))
    board.paste(image, (ox + 31, oy + 82))

board.save(out / "pdp-home-color-schemes-board.png")
print(out / "pdp-home-color-schemes-board.png")
