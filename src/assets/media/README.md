# Mahela media library

Pulled from the live WordPress media library (https://www.mahela.co.za/wp-json/wp/v2/media) on 2026-11-06.
553 library items, 535 images. Exact duplicates, screenshots, agency logos, placeholders and
Shutterstock-watermarked stock were dropped, leaving 417 files here.

Everything sits in `src/assets/` so Astro's `<Image>` / `<Picture>` can generate AVIF/WebP and responsive
sizes at build time. Files are optimised masters, not final web sizes:

- Photos: JPEG q80, longest edge max 2400 px (events/conservation 2000, archive 1600 at q74), EXIF stripped and orientation applied.
- Transparent cut-outs: WebP with alpha, q86.
- Logos, certifications and PNG harvest charts: PNG.

`manifest.json` maps every file back to its WordPress ID, original URL, title and alt text.
The PDFs (13), videos (3) and zips (2) in the WP library were not pulled.

## Folders

| Folder | What's in it |
| --- | --- |
| `brand/` | `mahela-logo-stacked.png` (1208 px, navy approx. #2B3380), `mahela-emblem-hires.png` (2400 px elephant emblem, transparent, cropped from the POPI-manual logo, brighter blue approx. #115095), `mahela-logo-popi-manual-hires.png`, elephant pattern, green triangle band, 2026 orange "splash" graphics, Mahela / Makulu / Mala-Mala brand strip |
| `certifications/` | GlobalGAP, NSF Registered, SIZA: grey 2026 versions and colour 2019 versions |
| `produce/cutouts/` | 2026 transparent produce: oranges with leaves, naartjie, lemon, grapefruit, avocado, kiwi, lychee, macadamia, banana, orange slice |
| `produce/cards/` | 2026 produce poster cards (1000x1300), a/b/c variants per crop |
| `produce/styled/` | 2026 styled stock shots (grapefruit on blue, avocados on white) |
| `produce/photos/` | Mahela-branded fruit photography (citrus, lemons, Star Ruby, shaddock, Tango, litchis, kiwis, macadamias) |
| `farms/` | Orchards, aerials, dams, nursery, Ohrigstad developments, offices |
| `packhouse/` | 2019 packhouse shoot (DSCF series), lines, cold store, trucks, boxes |
| `people/` | Directors' portraits (Eddie, Edward, Francois, Pieter, Barend), family, staff group photos, 2025 team shoot |
| `community/` | Mahela Cares school and community photos |
| `conservation/` | Game and conservation: buffalo, sable, wild dog, kudu, cattle |
| `events/` | Makulu Bush Concert (2019) and 2024 evening events |
| `press/` | Magazine and newspaper clippings |
| `social/` | 2021 Instagram-style 640x640 squares |
| `patterns/` | 2026 black-and-white fruit patterns |
| `harvest-calendars/` | Harvest calendar charts per crop (2019 and 2024). Better rebuilt as HTML, kept for reference |
| `archive/stock/` | Generic 2019 stock photography (Pexels and similar), check licence before use |
| `archive/tango-gin/` | Tango Citrus Gin concept artwork (password-protected page on the old site) |

## Re-running

`scripts/media/classify.py` and `scripts/media/process.py` are the scripts used. They expect the WP originals
downloaded into a folder that mirrors `wp-content/uploads/`.
