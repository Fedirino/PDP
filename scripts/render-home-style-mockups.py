from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / "mockup-images"
out.mkdir(exist_ok=True)

try:
    bold = ImageFont.truetype("arialbd.ttf", 24)
    semi = ImageFont.truetype("arialbd.ttf", 18)
    font = ImageFont.truetype("arial.ttf", 15)
    small = ImageFont.truetype("arial.ttf", 12)
    tiny = ImageFont.truetype("arial.ttf", 10)
    hero = ImageFont.truetype("arialbd.ttf", 30)
except Exception:
    bold = semi = font = small = tiny = hero = ImageFont.load_default()


def h(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def rr(d, box, r, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def text(d, xy, value, fnt, fill):
    d.text(xy, value, font=fnt, fill=fill)


def icon(d, kind, cx, cy, col):
    if kind == "search":
        d.ellipse((cx - 8, cy - 8, cx + 5, cy + 5), outline=col, width=3)
        d.line((cx + 4, cy + 4, cx + 12, cy + 12), fill=col, width=3)
    elif kind == "list":
        for i in range(3):
            d.line((cx - 7, cy - 8 + i * 8, cx + 12, cy - 8 + i * 8), fill=col, width=3)
            d.ellipse((cx - 15, cy - 10 + i * 8, cx - 12, cy - 7 + i * 8), fill=col)
    elif kind == "cal":
        d.rounded_rectangle((cx - 13, cy - 12, cx + 13, cy + 13), radius=4, outline=col, width=3)
        d.line((cx - 13, cy - 5, cx + 13, cy - 5), fill=col, width=3)
    elif kind == "folder":
        d.line((cx - 14, cy - 8, cx - 4, cy - 8, cx, cy - 3, cx + 14, cy - 3, cx + 14, cy + 11, cx - 14, cy + 11, cx - 14, cy - 8), fill=col, width=3)
    else:
        d.line((cx - 12, cy + 11, cx + 9, cy - 10), fill=col, width=3)
        d.ellipse((cx - 14, cy + 9, cx - 8, cy + 15), outline=col, width=3)
        d.ellipse((cx + 7, cy - 14, cx + 13, cy - 8), outline=col, width=3)


base = {
    "bg": h("#0c1016"),
    "surface": h("#151b23"),
    "surface2": h("#1b2430"),
    "ink": h("#f1f5f4"),
    "ink2": h("#b6c1c2"),
    "ink3": h("#778589"),
    "line": h("#2b3744"),
    "brand": h("#55d9ad"),
    "brand2": h("#72e5bd"),
    "tint": h("#15342f"),
    "hero1": h("#1c3037"),
    "hero2": h("#166050"),
}


def shell(style_name, tag, bg=None):
    im = Image.new("RGB", (328, 688), bg or base["bg"])
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, 327, 687), radius=34, outline=base["line"], width=1)
    return im, d


def topbar(d, minimal=False):
    d.rectangle((0, 0, 328, 66), fill=base["bg"])
    d.line((0, 65, 328, 65), fill=base["line"])
    rr(d, (16, 16, 50, 50), 10, base["tint"])
    text(d, (26, 22), "P", semi, base["brand2"])
    if not minimal:
        text(d, (62, 21), "PDP", bold, base["ink"])
    rr(d, (278, 16, 312, 50), 17, base["surface2"], base["line"])
    text(d, (287, 25), "PD", tiny, base["brand2"])


def tabs(d):
    d.rectangle((0, 620, 328, 688), fill=base["bg"])
    d.line((0, 620, 328, 620), fill=base["line"])
    labels = [("Home", "search"), ("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Tools", "tools")]
    for i, (label, kind) in enumerate(labels):
        cx = 33 + i * 65
        col = base["brand2"] if i == 0 else base["ink3"]
        if i == 0:
            rr(d, (cx - 19, 628, cx + 19, 653), 13, base["tint"])
        icon(d, kind, cx, 641, col)
        text(d, (cx - len(label) * 3, 660), label, tiny, col)


def tile(d, box, name, kind, fill=None, outline=None):
    fill = fill or base["surface"]
    outline = outline or base["line"]
    rr(d, box, 14, fill, outline)
    rr(d, (box[0] + 12, box[1] + 12, box[0] + 48, box[1] + 48), 11, base["tint"])
    icon(d, kind, box[0] + 30, box[1] + 30, base["brand2"])
    text(d, (box[0] + 12, box[3] - 30), name, semi, base["ink"])


def draw_operational():
    im, d = shell("Command Center", "command")
    topbar(d)
    text(d, (18, 88), "Today", tiny, base["ink3"])
    text(d, (18, 106), "Good morning", hero, base["ink"])
    text(d, (18, 143), "Saturday, September 12 - 8:42 AM", small, base["ink2"])
    rr(d, (18, 177, 310, 246), 14, base["surface"], base["line"])
    text(d, (34, 194), "NEXT IN", tiny, base["ink3"])
    text(d, (34, 214), "Jordan - 9:00", semi, base["ink"])
    rr(d, (206, 194, 292, 229), 10, base["tint"])
    text(d, (220, 203), "Schedule", small, base["brand2"])
    rr(d, (18, 258, 310, 328), 14, base["surface"], base["line"])
    text(d, (34, 276), "DAILY CHECKLIST", tiny, base["ink3"])
    text(d, (34, 297), "5 of 11 done", semi, base["ink"])
    d.rectangle((34, 318, 292, 322), fill=base["surface2"])
    d.rectangle((34, 318, 151, 322), fill=base["brand"])
    text(d, (18, 360), "Quick access", tiny, base["ink3"])
    y = 382
    for name, kind in [("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Documents", "folder")]:
        rr(d, (18, y, 310, y + 52), 12, base["surface"], base["line"])
        icon(d, kind, 44, y + 26, base["brand2"])
        text(d, (70, y + 15), name, semi, base["ink"])
        text(d, (286, y + 15), ">", semi, base["ink3"])
        y += 62
    tabs(d)
    return im


def draw_soft_cards():
    im, d = shell("Soft Cards", "cards", h("#f2f5f1"))
    ink = h("#17231f"); muted = h("#64756d"); line = h("#d5e1da"); green = h("#2b8f65")
    d.rectangle((0, 0, 328, 66), fill=h("#f8faf7")); d.line((0, 65, 328, 65), fill=line)
    rr(d, (16, 16, 50, 50), 12, h("#dff2e8")); text(d, (26, 22), "P", semi, green)
    text(d, (62, 21), "PDP", bold, ink)
    rr(d, (18, 90, 310, 260), 26, h("#ffffff"), line)
    text(d, (38, 112), "Produce Department", tiny, muted)
    text(d, (38, 132), "Good morning", hero, ink)
    text(d, (38, 170), "Saturday, September 12 - 8:42 AM", small, muted)
    rr(d, (38, 202, 176, 240), 13, h("#e6f5ed"), h("#c5dfd1"))
    text(d, (51, 212), "Jordan - 9:00", font, ink)
    rr(d, (186, 202, 290, 240), 13, h("#fff7dc"), h("#eadca7"))
    text(d, (201, 212), "18 left", font, ink)
    text(d, (18, 290), "Today", tiny, muted)
    rr(d, (18, 312, 310, 373), 18, h("#ffffff"), line)
    text(d, (38, 329), "Daily Checklist", semi, ink)
    text(d, (38, 353), "5 of 11 done today", small, muted)
    text(d, (18, 404), "Quick access", tiny, muted)
    for (name, kind), box in zip([("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Documents", "folder")], [(18, 426, 155, 516), (173, 426, 310, 516), (18, 528, 155, 618), (173, 528, 310, 618)]):
        rr(d, box, 20, h("#ffffff"), line)
        rr(d, (box[0]+14, box[1]+14, box[0]+52, box[1]+52), 14, h("#dff2e8"))
        icon(d, kind, box[0]+33, box[1]+33, green)
        text(d, (box[0]+14, box[3]-34), name, semi, ink)
    return im


def draw_split_hero():
    im, d = shell("Split Hero", "split")
    topbar(d)
    rr(d, (18, 86, 310, 208), 20, base["hero1"], base["line"])
    text(d, (36, 106), "Good", hero, base["ink"])
    text(d, (36, 137), "morning", hero, base["ink"])
    text(d, (36, 177), "September 12 - 8:42 AM", small, base["ink2"])
    rr(d, (36, 224, 154, 308), 16, base["tint"], base["line"])
    text(d, (51, 244), "Next in", tiny, base["brand2"])
    text(d, (51, 266), "Jordan", semi, base["ink"])
    text(d, (51, 288), "9:00", small, base["ink2"])
    rr(d, (174, 224, 292, 308), 16, base["surface"], base["line"])
    text(d, (189, 244), "List", tiny, base["ink3"])
    text(d, (189, 266), "18 left", semi, base["ink"])
    text(d, (18, 340), "Quick actions", tiny, base["ink3"])
    for (name, kind), box in zip([("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Docs", "folder"), ("Tools", "tools")], [(18, 362, 102, 462), (122, 362, 206, 462), (226, 362, 310, 462), (18, 482, 154, 562), (174, 482, 310, 562)]):
        tile(d, box, name, kind)
    tabs(d)
    return im


def draw_dense_mobile():
    im, d = shell("Dense Mobile", "dense")
    topbar(d, minimal=True)
    text(d, (18, 84), "Good morning", hero, base["ink"])
    rr(d, (18, 127, 310, 171), 12, base["surface"], base["line"])
    text(d, (34, 140), "Next: Jordan - 9:00", font, base["ink"])
    rr(d, (18, 181, 310, 225), 12, base["surface"], base["line"])
    text(d, (34, 194), "List: 18 left / 7 found", font, base["ink"])
    rr(d, (18, 235, 310, 279), 12, base["surface"], base["line"])
    text(d, (34, 248), "Checklist: 5 of 11 done", font, base["ink"])
    text(d, (18, 312), "All tools", tiny, base["ink3"])
    y = 334
    items = [("Stencil", "search"), ("Load List", "list"), ("Schedule", "cal"), ("Documents", "folder"), ("Tools", "tools")]
    for name, kind in items:
        rr(d, (18, y, 310, y + 45), 10, base["surface"], base["line"])
        icon(d, kind, 42, y + 22, base["brand2"])
        text(d, (70, y + 13), name, font, base["ink"])
        y += 52
    tabs(d)
    return im


def draw_editorial():
    im, d = shell("Editorial Produce", "editorial", h("#101410"))
    topbar(d)
    # Leaf-like color blocks instead of real photos, just to show direction.
    for i, col in enumerate([h("#214d35"), h("#6fa461"), h("#d2b34e"), h("#8d3d35")]):
        d.ellipse((120 + i * 22, 82 + i * 8, 280 + i * 28, 234 + i * 18), fill=col)
    text(d, (24, 92), "Fresh floor", tiny, h("#a0b7a6"))
    text(d, (24, 116), "Good\nmorning", hero, h("#f4fff1"))
    rr(d, (24, 244, 304, 318), 18, h("#172017"), h("#344d38"))
    text(d, (42, 261), "Next in: Jordan - 9:00", font, h("#f4fff1"))
    text(d, (42, 286), "List: 18 left - Checklist: 5/11", small, h("#a0b7a6"))
    text(d, (18, 350), "Quick access", tiny, h("#a0b7a6"))
    for (name, kind), box in zip([("Stencil", "search"), ("List", "list"), ("Schedule", "cal"), ("Documents", "folder")], [(18, 372, 155, 472), (173, 372, 310, 472), (18, 492, 155, 592), (173, 492, 310, 592)]):
        rr(d, box, 18, h("#172017"), h("#344d38"))
        icon(d, kind, box[0]+34, box[1]+32, h("#8de1aa"))
        text(d, (box[0]+14, box[3]-34), name, semi, h("#f4fff1"))
    tabs(d)
    return im


def draw_terminal():
    im, d = shell("Ops Terminal", "terminal", h("#07110d"))
    green = h("#88f7a8"); dim = h("#5e8b6c"); panel = h("#0d1c14")
    d.rectangle((0, 0, 328, 688), fill=h("#07110d"))
    d.rounded_rectangle((0, 0, 327, 687), radius=34, outline=h("#1e3827"), width=1)
    text(d, (24, 30), "PDP / HOME", font, green)
    text(d, (24, 76), "> Good morning", hero, green)
    text(d, (24, 118), "Saturday, September 12 - 08:42", small, dim)
    for i, line in enumerate(["NEXT_IN     Jordan 09:00", "LIST        18 left / 7 found", "CHECKLIST   5 of 11 done"]):
        rr(d, (24, 165 + i * 58, 304, 209 + i * 58), 6, panel, h("#1e3827"))
        text(d, (39, 178 + i * 58), line, font, green)
    text(d, (24, 370), "COMMANDS", tiny, dim)
    commands = [("[1] Stencil", "search"), ("[2] List", "list"), ("[3] Schedule", "cal"), ("[4] Docs", "folder"), ("[5] Tools", "tools")]
    y = 395
    for name, kind in commands:
        text(d, (40, y), name, font, green)
        y += 34
    d.rectangle((0, 620, 328, 688), fill=h("#07110d"))
    d.line((0, 620, 328, 620), fill=h("#1e3827"))
    text(d, (24, 642), "HOME  STENCIL  LIST  SCHEDULE  TOOLS", small, dim)
    return im


styles = [
    ("Command Center", "command", draw_operational()),
    ("Soft Cards", "cards", draw_soft_cards()),
    ("Split Hero", "split", draw_split_hero()),
    ("Dense Mobile", "dense", draw_dense_mobile()),
    ("Editorial Produce", "editorial", draw_editorial()),
    ("Ops Terminal", "terminal", draw_terminal()),
]

for _, tag, image in styles:
    image.save(out / f"pdp-home-style-{tag}.png")

cell_w, cell_h = 390, 790
board = Image.new("RGB", (cell_w * 3, cell_h * 2), (232, 237, 241))
d = ImageDraw.Draw(board)
for index, (name, tag, image) in enumerate(styles):
    col = index % 3
    row = index // 3
    ox = col * cell_w
    oy = row * cell_h
    text(d, (ox + 32, oy + 24), name, bold, h("#172027"))
    text(d, (ox + 32, oy + 55), tag.upper(), tiny, h("#62707d"))
    board.paste(image, (ox + 31, oy + 82))

board.save(out / "pdp-home-style-mockups-board.png")
print(out / "pdp-home-style-mockups-board.png")
