"""Export camera originals to site-ready WebP and rebuild data/photos.json.

    python tools/photos.py            # export any new photos in NEW, then rebuild the manifest
    python tools/photos.py --manifest # only rebuild data/photos.json

Convention (README v3.5): photos are WebP, max 1600 px wide, quality 60.
data/photos.json is what library.html (the hidden photo index) reads. Each entry
records where the original lives, so a photo can be re-exported or swapped later.
"""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
MANIFEST = os.path.join(ROOT, "data", "photos.json")
CAM = r"E:\Photos\11112026 Camera Dump"
MON = r"E:\Photos\Event Photos\Mongolian Tournament 9-3-26"

# asset name -> (original, description, tags)
NEW = {
    "karate-tournament":       (rf"{CAM}\DSC_5091.JPG", "Karate tournament: competitors in gis, rings and a crowd", ["martial arts", "karate", "tournament", "mat sports"]),
    "martial-arts-expo":       (rf"{CAM}\DSC_5094.JPG", "Martial arts studio tables and trophies at a karate event", ["martial arts", "karate", "expo", "vendors"]),
    "tournament-group":        (rf"{CAM}\DSC_5078.JPG", "Big group photo on the hardwood under the Boomtown banner", ["tournament", "league", "group", "hero", "instagram"]),
    "vb-women-defense":        (rf"{CAM}\DSC_4590.JPG", "Women's volleyball, players ready on defense", ["volleyball", "sports", "women"]),
    "vb-set-colorado-boom":    (rf"{CAM}\DSC_3563.JPG", "Set at the net in front of the Colorado Boom wall", ["volleyball", "sports", "colorado boom"]),
    "vb-team-lineup":          (rf"{MON}\DSC_8356.JPG", "Team lined up and clapping before a match", ["volleyball", "sports", "team", "cultural"]),
    "party-vb-block":          (rf"{CAM}\DSC_4753.JPG", "Volleyball block with Oda Up behind the court", ["party", "volleyball", "oda up"]),
    "party-vb-spike":          (rf"{CAM}\DSC_4055.JPG", "Spike over a double block", ["party", "volleyball", "action"]),
    "party-vb-attack":         (rf"{CAM}\DSC_4034.JPG", "Attacker swinging, Oda Up sign in the back", ["party", "volleyball", "action", "oda up"]),
    "party-vb-dig":            (rf"{MON}\DSC_7335.JPG", "Player passing a ball, Oda Up and string lights behind", ["party", "volleyball", "oda up"]),
    "team-high-fives":         (rf"{CAM}\DSC_4871.JPG", "Colorado Boom players high-fiving down the line", ["team", "cheering", "party", "colorado boom"]),
    "team-mens-group":         (rf"{CAM}\DSC_4278.JPG", "Men's team grinning at the net", ["team", "party", "men"]),
    "team-mens-lineup":        (rf"{CAM}\DSC_4285.JPG", "Men's team lined up on the sports court", ["team", "party", "men"]),
    "medals-two-players":      (rf"{CAM}\DSC_4933.JPG", "Two players showing their medals", ["medals", "celebration", "colorado boom", "party"]),
    "activity-crafts":         (rf"{CAM}\DSC_5182.JPG", "Kids crafting at a long table, TV behind", ["activity room", "social den", "party", "crafts"]),
    "socialden-hall":          (rf"{CAM}\DSC_5127.JPG", "Full room of tables during an event, Halloween decorations", ["social den", "activity room", "event", "crowd"]),
    "socialden-evening":       (rf"{CAM}\DSC_5123.JPG", "Evening at the Social Den tables", ["social den", "lounge"]),
    "socialden-crowd":         (rf"{CAM}\DSC_5122.JPG", "Social Den packed with guests at wood tables", ["social den", "lounge", "crowd"]),
    "activity-crafts-detail":  (rf"{CAM}\DSC_5212.JPG", "Close-up of a craft project and glue gun", ["activity room", "crafts", "detail"]),
    "activity-crafts-table":   (rf"{CAM}\DSC_5225.JPG", "Kids at the craft table with a candy jar", ["activity room", "crafts", "party"]),
    "sportcourt-set":          (rf"{CAM}\DSC_3388.JPG", "Junior volleyball on the sports court", ["sports court", "volleyball", "juniors"]),
    "sportcourt-pass":         (rf"{CAM}\DSC_3384.JPG", "Setter under the ball on the sports court", ["sports court", "volleyball", "juniors"]),
    "sportcourt-attack":       (rf"{CAM}\DSC_3341.JPG", "Attack and block on the sports court", ["sports court", "volleyball", "juniors"]),
    "hardwood-set":            (rf"{CAM}\DSC_3316.JPG", "Junior set on the hardwood, Boom wall behind", ["hardwood", "volleyball", "juniors"]),
    "hardwood-junior-set":     (rf"{CAM}\DSC_3313.JPG", "Junior team on the hardwood, setter jumping", ["hardwood", "volleyball", "juniors"]),
    "hardwood-dig":            (rf"{CAM}\DSC_3273.JPG", "Junior dig on the hardwood with spectators", ["hardwood", "volleyball", "juniors", "crowd"]),
    "hardwood-attack":         (rf"{CAM}\DSC_3969.JPG", "Women's attack on the hardwood", ["hardwood", "volleyball", "women"]),
    "hardwood-block":          (rf"{CAM}\DSC_3883.JPG", "Block at the net on the hardwood", ["hardwood", "volleyball", "women"]),
    "hardwood-double-block":   (rf"{CAM}\DSC_3646.JPG", "Double block on the hardwood", ["hardwood", "volleyball", "women"]),
    "hardwood-team":           (rf"{CAM}\DSC_4292.JPG", "Men's team holding their shirts", ["hardwood", "team", "men"]),
    "hardwood-mens-block":     (rf"{MON}\DSC_8193.JPG", "Men's block and attack on the hardwood", ["hardwood", "volleyball", "men", "cultural"]),
    "cultural-trophy":         (rf"{MON}\DSC_8661.JPG", "Trophy and medals at a community tournament", ["cultural", "awards", "community"]),
    "cultural-mens-match":     (rf"{MON}\DSC_8243.JPG", "Men's match with a crowd and the mezzanine behind", ["cultural", "volleyball", "crowd"]),
    "cultural-flag-bench":     (rf"{MON}\DSC_8260.JPG", "Team bench under the Mongolian flag", ["cultural", "flag", "team"]),
    "cultural-flag-crowd":     (rf"{MON}\DSC_8138.JPG", "Spectators and the score table under the Mongolian flag", ["cultural", "flag", "crowd"]),
    "cultural-team-lineup":    (rf"{MON}\DSC_8345.JPG", "Women's teams lined up, flag behind", ["cultural", "volleyball", "team"]),
    "crowd-bleachers":         (rf"{MON}\DSC_8206.JPG", "Full bleachers under the mezzanine", ["crowd", "spectators", "mezzanine"]),
    "crowd-courtside":         (rf"{MON}\DSC_8303.JPG", "Packed courtside crowd during a women's match, Oda Up behind", ["crowd", "spectators", "volleyball", "oda up"]),
}

# Phone photos uploaded 2026-11-21 (originals: IMG_/DSC file names from the phone).
# asset name -> (original, description, tags). Already exported; listed for the manifest.
PHONE = {
    'concourse-seating': ('IMG_3482.jpeg', 'Main concourse with picnic tables and rolling bleachers, empty', ['concourse', 'lobby', 'seating']),
    'lobby-front-desk': ('IMG_3501.jpeg', 'Front desk and main concourse during a busy day, Volo and Colorado Boom banners', ['lobby', 'entrance', 'front-desk', 'concourse']),
    'odaup-halloween-group': ('IMG_3614.jpeg', 'Adult league players in Halloween costumes with drinks at the Oda Up counter', ['oda-up', 'bar', 'adults', 'halloween', 'league']),
    'odabar-halloween': ('IMG_3628.jpeg', 'Adult league team in mime costumes at the Oda Up bar', ['oda-up', 'bar', 'adults', 'halloween', 'league']),
    'boom-team-photo': ('DSC00106.jpeg', 'Colorado Boom team and coaches posed at the net on the hardwood', ['colorado-boom', 'hardwood', 'team', 'juniors']),
    'court4-boom-practice': ('IMG_3713.jpeg', 'Colorado Boom practice on Zone 4, setter and hitter at the net', ['colorado-boom', 'hardwood', 'zone-4', 'juniors', 'volleyball']),
    'court3-boom-huddle': ('IMG_3718.jpeg', 'Colorado Boom coach huddle on Zone 3 around the ball cart', ['colorado-boom', 'hardwood', 'zone-3', 'juniors', 'coaching']),
    'studio-tables': ('IMG_3726.jpeg', 'Club meeting at rolling tables in the studio', ['studio', 'meeting', 'colorado-boom']),
    'socialden-lights-blur': ('IMG_7264.jpeg', 'Social Den under string lights, busy and motion-blurred (library only)', ['social-den', 'lounge', 'crowd']),
    'socialden-fireplace': ('IMG_7269.jpeg', 'Colorado Boom players in the Social Den under string lights, fireplace behind', ['social-den', 'lounge', 'colorado-boom', 'juniors']),
    'boom-club-meeting': ('IMG_3886.jpeg', 'Whole club seated in a circle on the hardwood, Oda Up behind', ['colorado-boom', 'hardwood', 'club', 'meeting', 'juniors']),
    'yoga-studio-mats': ('IMG_3937.jpeg', 'Studio set with rows of yoga mats, before class', ['studio', 'yoga-den', 'mats']),
    'yoga-studio-instructor': ('IMG_4004.jpeg', 'Instructor leading a big yoga and mobility class in the studio', ['studio', 'yoga-den', 'class', 'mobility', 'juniors']),
    'yoga-studio-class': ('IMG_4006.jpeg', 'Full yoga and mobility class balancing on the mats', ['studio', 'yoga-den', 'class', 'mobility', 'juniors']),
    'studio-agility-drill': ('IMG_4076.jpeg', 'Agility drill with cones in the studio', ['studio', 'conditioning', 'juniors']),
    'studio-coach-plank': ('IMG_4133.jpeg', 'Coach running a plank set, players along both walls', ['studio', 'conditioning', 'juniors', 'coaching']),
    'studio-plank-line': ('IMG_4136.jpeg', 'Low angle down a line of players holding a plank', ['studio', 'conditioning', 'juniors']),
    'court3-boom-huddle-pink': ('IMG_4268.jpeg', 'Colorado Boom players in pink huddled with coaches on Zone 3', ['colorado-boom', 'hardwood', 'zone-3', 'juniors', 'coaching']),
    'sportcourt-adult-league': ('IMG_4329.jpeg', 'Adult league match on the sports court, block at the net', ['sports-court', 'adults', 'league', 'volleyball']),
    'sportcourt-adult-practice': ('IMG_4338.jpeg', 'Adult training session on the sports court, passing drill', ['sports-court', 'adults', 'training', 'volleyball']),
    # BT-site photos added 2026-11-21 (owner-supplied)
    'league-attack-restrooms': ('BT library (7.jpg, 2026-11-21 upload)', "Women's league attack and block on the hardwood, restrooms sign behind", ['hardwood', 'volleyball', 'women', 'league']),
    'league-team-four': ('BT library (8.jpg)', "Four women's league players smiling on the hardwood", ['team', 'women', 'league', 'social']),
    'league-team-number-one': ('BT library (9.jpg)', "Women's league team holding up number one at the net", ['team', 'women', 'league', 'celebration']),
    'league-spike-double-block': ('BT library (10.jpg)', "Women's league spike over a double block, Boomtown shirt in front", ['hardwood', 'volleyball', 'women', 'league', 'action']),
    'league-attack-denver-juniors': ('BT library (11.jpg)', 'Attack into a double block in front of the Denver Juniors banner', ['hardwood', 'volleyball', 'women', 'league', 'action']),
    'league-tip-denver-juniors': ('BT library (12.jpg)', 'Tip over the block in front of the Denver Juniors banner', ['hardwood', 'volleyball', 'women', 'league', 'action']),
    'league-attack-bright-lights': ('BT library (13.jpg)', 'Attack past a block under the fieldhouse lights', ['hardwood', 'volleyball', 'women', 'league', 'action']),
    'league-tip-boomtown-banner': ('BT library (14.jpg)', 'Tip at the net with the Boomtown Athletics banner behind', ['hardwood', 'volleyball', 'women', 'league', 'boomtown']),
    'zone5-sportcourt-attack': ('BT library (15.jpg)', 'Attack and dig on the red and blue sports court in Zone 5', ['sports-court', 'zone-5', 'volleyball', 'adults']),
    'zone5-sportcourt-tip': ('BT library (16.jpg)', 'Player tipping over the block on the Zone 5 sports court', ['sports-court', 'zone-5', 'volleyball', 'adults']),
    'zone5-sportcourt-swing': ('BT library (17.jpg)', 'Attacker swinging past the block on the Zone 5 sports court', ['sports-court', 'zone-5', 'volleyball', 'adults']),
    'team-hands-in': ('BT library (18.jpg)', 'Friends stacking hands at the net before a game', ['team', 'social', 'party', 'adults']),
    'fieldhouse-open-floor': ('btvb assets/img/library/fieldhouse-interior-wide.jpg', 'Wide view of the empty hardwood floor and courts', ['hardwood', 'open floor', 'facility', 'empty']),
    'party-inflatable': ('Pexels photo 40091926 (free license): https://www.pexels.com/photo/children-playing-on-colorful-inflatable-bouncer-40091926/', 'Stock: boy running across a colorful inflatable', ['stock', 'party', 'inflatable', 'kids']),
}

# what older files are (for the manifest). Anything not listed shows its file name only.
OLD = {
    "fieldhouse-panorama": "Court panorama from the admin desk during a tournament",
    "fieldhouse-entrance": "Main entrance", "fieldhouse-overhead": "Courts from the mezzanine",
    "fieldhouse-sign": "Fieldhouse sign", "lobby": "Front lobby",
    "court-1": "Zone 1 volleyball", "court-2": "Zone 2", "court-3": "Zone 3 volleyball", "court-4": "Zone 4",
    "court-5": "Zone 6 volleyball", "court-6": "Volleyball courts", "court-7": "Zone 7",
    "shoot360": "Shoot 360 training floor", "shoot360-bays": "Shoot 360 shooting bays",
    "socialden-tables": "Social Den tables (stock)", "socialden-cafe": "Social Den cafe (stock)", "socialden-lounge": "Social Den lounge (stock)",
    "odaup-dining": "Oda Up dining", "odaup-food": "Oda Up food", "odaup-bowl": "Oda Up bowl",
    "odabar-toast": "Bar toast", "odabar-glasses": "Bar glasses", "yoga-meadow": "Yoga class (stock)",
    "danceden-class": "Dance class (stock)", "danceden-kids": "Kids dance (stock)", "mezz-lounge": "Mezzanine lounge",
    "event-dinner": "Dinner event (stock)", "event-hall": "Event setup (stock)", "event-concert": "Concert (stock)",
    "party-hero": "Confetti party (Unsplash stock)", "party-karaoke": "Karaoke (Unsplash stock)", "party-bounce": "Inflatable (Unsplash stock)",
    "party-kids": "Kids birthday (Unsplash stock)", "party-watch": "Watch party (Unsplash stock)", "party-hoops": "Kids basketball (Unsplash stock)",
    "party-pizza": "Pizza (Unsplash stock)", "og-image": "Share card 1200x630", "og-party": "Party share card",
    "og-tournaments": "Tournaments share card 1200x630 (from DSC_5078)",
}


def export(name, src):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im.thumbnail((1600, 1600), Image.LANCZOS)
    im.save(os.path.join(ASSETS, name + ".webp"), "WEBP", quality=60, method=6)
    return im.size


def og_card():
    """1200x630 share card for tournaments.html, from the group photo."""
    im = ImageOps.exif_transpose(Image.open(NEW["tournament-group"][0])).convert("RGB")
    w, h = im.size
    ch = int(w * 630 / 1200)
    top = int(h * 0.20)
    im.crop((0, top, w, top + ch)).resize((1200, 630), Image.LANCZOS).save(
        os.path.join(ASSETS, "og-tournaments.jpg"), quality=82, optimize=True, progressive=True)


def manifest():
    prev = {}
    if os.path.exists(MANIFEST):
        prev = {p["path"]: p for p in json.load(open(MANIFEST, encoding="utf-8"))["photos"]}
    photos = []
    for f in sorted(os.listdir(ASSETS)):
        stem, ext = os.path.splitext(f)
        if ext.lower() not in (".webp", ".jpg", ".png"):
            continue
        if ext.lower() == ".jpg" and os.path.exists(os.path.join(ASSETS, stem + ".webp")):
            continue  # .jpg master of a .webp: list the webp only
        path = "assets/" + f
        with Image.open(os.path.join(ASSETS, f)) as im:
            w, h = im.size
        e = dict(prev.get(path, {}))
        e.update(path=path, w=w, h=h, kb=round(os.path.getsize(os.path.join(ASSETS, f)) / 1024))
        if stem in NEW:
            e.update(desc=NEW[stem][1], source=NEW[stem][0], tags=NEW[stem][2], added="2026-11-20")
        elif stem in PHONE:
            e.update(desc=PHONE[stem][1], source=PHONE[stem][0], tags=PHONE[stem][2], added="2026-11-21")
        e.setdefault("desc", OLD.get(stem, ""))
        e.setdefault("tags", [])
        if os.path.exists(os.path.join(ASSETS, stem + ".jpg")) and ext.lower() == ".webp":
            e["master"] = "assets/" + stem + ".jpg"
        photos.append(e)
    json.dump({"note": "Built by tools/photos.py. library.html reads this; 'In use' is worked out live from the pages.",
               "photos": photos}, open(MANIFEST, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(len(photos), "photos in", MANIFEST)


if __name__ == "__main__":
    if "--manifest" not in sys.argv:
        for name, (src, *_rest) in NEW.items():
            if not os.path.exists(os.path.join(ASSETS, name + ".webp")):
                print(name, export(name, src))
        og_card()
    manifest()
