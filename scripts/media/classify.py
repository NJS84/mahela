import re, sys, json
cands=[l.strip() for l in open(sys.argv[1]) if l.strip()]
R=[
 ('exclude', r'Avos_Fuerte|Avos_lambHass|Avoz_Ryan|Oranges_navel|Organge_Valencia|stock-photo-lemons|2019/01/Mahela-Logo|2019/02/MahelaLogoHighRes|2026/07/MahelaLogoHighRes|2019/02/cropped|WG-Logo|2019/03/MahelaLogoHighRes-copy-1|2026/06/(NSF_Registered_Logo|logo_login_whiteV2)-1\.png|2026/06/Logo_GlobalGAP1-1024x178-2|2019/02/About-us_photo1|2025/01/PHOTO-2025-01-09'),
 ('brand', r'MahelaLogoHighRes|Primary-logo-POPI|MAHELA-ELEPHANT|hi-res-brands|Mala-Mala-Banana|2026/05/|Mahela-Group-Citrus|cropped-MahelaLogo'),
 ('certifications', r'GlobalGAP|NSF_Registered|logo_login_whiteV2'),
 ('produce/cards', r'2026/07/(Avo|Banana|Citrus|Litchi|Macs)(-1)?\.(png|jpg)$'),
 ('produce/cutouts', r'2026/07/(Citrus1|Citrus2|lemon|nartjie)\.png|2026/06/(Avocado|Citrus)\.png|isolated-on-white|macadamia-nuts-with-green|exotic-lychee|fresh-avocado-cut|partially-peeled-banana|vibrant-close-up|whole-and-cut-avocados|grapefruit|graprefruit'),
 ('patterns', r'2026/06/(Kiwi|Avo|Tasty-Oranges-copy|bananas|litchis|macs)\.png|2026/06/36\.jpg'),
 ('harvest-calendars', r'2019/04/(Avo|Bananas|Citrus|Kiwis|Litchis|Macs)|2019/04/Mahela-|2019/05/(Avo2|Bananas|Citrus|Kiwis|Litchis|Litichis|Macs|macadamias)|2019/05/Untitled-2|2024/02/|2025/03/Variety|mahelaTable'),
 ('archive/tango-gin', r'2019/03/(M[\w-]*\.(jpg|png)|M2-1|Mahela-Gin|Mahela-New|Untitled|12121|m6|orange\.jpg)'),
 ('press', r'Megaboerdery|AgriPen|2021/07/|Plaaslike|300323LNS108|Partners-pull|biologicalcongrol|2024/10/mahela1|orchardplanning'),
 ('social', r'2021/10/[^/]+\.png$'),
 ('people', r'2019/02/(Eddie|Edward|Fracois2|Pieter|barend)|vorsters|2019/01/About-us_photo1|Staff-photo|2020/01/IMG_5852|DHK_9884|DHK_0807|2025/01/DSC_(0567|1211|1424|1282|1333)|PHOTO-2020-10-08|AdriaanFichardt|BYQOE6630|2019/05/unnamed-file|DSCF05(66|73)'),
 ('packhouse', r'2019/05/DSCF|2019/01/(packhouse1|packhuis|pakhuis|unnamed-[145]|About-us_photo3|Products_Packinghouse)|DHK_8670|DSC_1871|2026/07/(DSCF0541|packhouse1)|packhuis-bou|ohrigstadpakhuis'),
 ('community', r'MahelaCares|20190504_080951|IMG-20190504-WA0014|accessories-adult-blur|approve-boy|The-newly-renovated'),
 ('conservation', r'Game-and-Conservation|WhatsApp-Image-2019-04-11-at-09\.54\.(1[789]|2)|2019/02/(animal|african-wild-dog)|DSC_8959|buffel1|2025/01/DSC_(0378|0526|1615)|pxhere|mahelabeeste'),
 ('events', r'Makulu-Bush-Concert|2024/07/|IMG-20190520'),
 ('farms', r'sirusboorde|sitrusboorde|About-us_photo2|DXQZsX8X|Kwekery|Tango_April|Ohrigstad|IMG_3412|IMG-20190711|2019/07/Picture1|DHK_8632|DHK_9895|DSC_7988|DHK_8485|DSC_9156|Irrigation-dam|citrus-trees|mandarin-citrus-orchard|2025/01/DSC_(1689|1739|1779|1802|1894)|2019/01/unnamed(-6)?\.jpg|blossoms|2021/10/IMG_6415|2020/01/IMG-20191001'),
 ('produce/photos', r'Mahela_AUG|Oranges-36|Lichis|2020/03/(8|IMG)|Lemon30|Lemon6|Star-Ruby|Shadock|Tango27|2019/01/(tango\d|shaddoc|star-ruby)|pomelo\.jpg|IMG_3205|7c53a5|751d1487|IMG_9307|WA0012|WhatsApp-Image-2019-04-11|ripe-oranges-on-tree'),
 ('archive/stock', r'2019/0[12]/'),
]
out={}
for c in cands:
  for cat,rx in R:
    if re.search(rx,c): out[c]=cat; break
  else: out[c]='UNMATCHED'
json.dump(out,open(sys.argv[2],'w'),indent=1)
import collections; print(collections.Counter(out.values()))
for k,v in out.items():
  if v=='UNMATCHED': print(k)
