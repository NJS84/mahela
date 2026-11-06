import json, re, os, sys
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS=None
src, cats, meta, out = sys.argv[1:5]
cats=json.load(open(cats)); wp={x['source_url'].split('/uploads/')[1]:x for x in json.load(open(meta))}
MAX={'archive/stock':1600,'archive/tango-gin':1600,'events':2000,'press':1800,'social':1080,'conservation':2000,'harvest-calendars':2400}
Q={'archive/stock':74,'archive/tango-gin':74}
def slug(p):
  n=os.path.splitext(os.path.basename(p))[0].lower()
  n=re.sub(r'-?20\d\d-\d\d-\d\d-\d\d-\d\d-\d\d-utc','',n)
  n=re.sub(r'-o7[a-z0-9]{30,}','',n)
  n=re.sub(r'(-copy)?(-\d)?(-\d)?$', lambda m: m.group(0) if not m.group(1) else '', n)
  n=re.sub(r'[^a-z0-9]+','-',n).strip('-')[:60].strip('-')
  return n
RN={
 '2019/03/MahelaLogoHighRes.png':'mahela-logo-stacked','2021/08/Primary-logo-POPI-01.png':'mahela-logo-popi-manual-hires',
 '2026/06/MAHELA-ELEPHANT.png':'elephant-pattern','2019/05/hi-res-brands.jpg':'brands-mahela-makulu-malamala',
 '2019/02/Mala-Mala-Banana-filtered.jpg':'mala-mala-banana-label','2019/03/MahelaLogoHighRes-copy.png':'triangle-band-green',
 '2026/05/216dd76d-7e43-4d7a-ac70-8e67514b3a53.png':'orange-splash','2026/05/Mahela-Group-1.png':'orange-splash-sticker',
 '2026/06/Mahela-Group-Citrus.png':'orange-splash-tall',
 '2026/06/Logo_GlobalGAP1-1024x178-1.png':'globalgap','2026/06/NSF_Registered_Logo.png':'nsf-registered','2026/06/logo_login_whiteV2.png':'siza',
 '2019/01/Logo_GlobalGAP1-1024x178.png':'globalgap-colour','2019/01/NSF_Registered_Logo.png':'nsf-registered-colour','2019/01/logo_login_whiteV2.png':'siza-colour',
 '2026/07/Avo.png':'avocado-card-a','2026/07/Avo-1.png':'avocado-card-b','2026/07/Avo.jpg':'avocado-card-c',
 '2026/07/Banana.png':'banana-card-a','2026/07/Banana-1.png':'banana-card-b','2026/07/Banana.jpg':'banana-card-c',
 '2026/07/Citrus.png':'citrus-card-a','2026/07/Citrus-1.png':'citrus-card-b','2026/07/Citrus.jpg':'citrus-card-c',
 '2026/07/Litchi-1.png':'litchi-card-a','2026/07/Litchi-1.jpg':'litchi-card-b',
 '2026/07/Macs.png':'macadamia-card-a','2026/07/Macs-1.png':'macadamia-card-b','2026/07/Macs.jpg':'macadamia-card-c',
 '2026/07/Citrus1.png':'orange-with-leaves-a','2026/07/Citrus2.png':'orange-with-leaves-b','2026/07/lemon.png':'lemon','2026/07/nartjie.png':'naartjie',
 '2026/06/Avocado.png':'avocado-pair-sticker','2026/06/Citrus.png':'grapefruit-sticker',
 '2026/06/close-up-yellow-kiwi-fruit-isolated-on-white-back-2026-03-16-02-12-15-utc-copy-1.png':'kiwi-halved',
 '2026/06/delicious-macadamia-nuts-with-green-leaves-on-whit-2026-03-19-23-15-05-utc-copy-1.png':'macadamia-nuts-leaves',
 '2026/06/exotic-lychee-fruit-on-dark-textured-background-2026-03-25-00-28-21-utc-copy-1.png':'lychee',
 '2026/06/fresh-avocado-cut-in-half-on-white-background-2026-03-18-05-39-56-utc-copy-1.png':'avocado-halved',
 '2026/06/partially-peeled-banana-on-a-white-background-2026-01-31-00-26-55-utc-copy-1.png':'banana-peeled',
 '2026/06/vibrant-close-up-of-fresh-cut-orange-slice-2026-01-05-05-30-22-utc-copy-1.png':'orange-slice',
}
used=set(); manifest=[]
for p,cat in sorted(cats.items()):
  if cat=='exclude': continue
  if cat=='produce/cutouts' and p.endswith('.jpg'): cat='produce/styled'
  im=Image.open(os.path.join(src,p)); im.seek(0)
  im=ImageOps.exif_transpose(im)
  alpha = im.mode in('RGBA','LA','P') and 'A' in im.convert('RGBA').getbands() and im.convert('RGBA').getchannel('A').getextrema()[0]<250
  m=MAX.get(cat,2400)
  if cat=='brand': m=2400
  im.thumbnail((m,m), Image.LANCZOS)
  base=RN.get(p) or slug(p)
  base=re.sub(r'(-1)+$','',base) if p not in RN else base
  if base in used or any(u.startswith(base+'.') for u in used): base=p[:4]+'-'+base
  i=2; b0=base
  while base in used: base=f'{b0}-{i}'; i+=1
  used.add(base)
  d=os.path.join(out,cat); os.makedirs(d,exist_ok=True)
  if cat in('brand','certifications') or (cat=='harvest-calendars' and p.endswith('.png')):
    fn=base+'.png'; im.convert('RGBA' if alpha else 'RGB').save(os.path.join(d,fn),optimize=True)
  elif alpha:
    fn=base+'.webp'; im.convert('RGBA').save(os.path.join(d,fn),'WEBP',quality=86,method=6)
  else:
    fn=base+'.jpg'; im.convert('RGB').save(os.path.join(d,fn),'JPEG',quality=Q.get(cat,80),optimize=True,progressive=True)
  w=wp.get(p,{})
  manifest.append({'file':f'{cat}/{fn}','category':cat,'width':im.width,'height':im.height,'transparent':bool(alpha),
    'wp_id':w.get('id'),'wp_url':w.get('source_url'),'wp_title':(w.get('title') or {}).get('rendered'),'alt':w.get('alt_text') or ''})
  print(cat,fn,im.size,flush=True)
# high-res emblem cropped from the POPI manual logo (no POPI text)
big=Image.open(os.path.join(src,'2021/08/Primary-logo-POPI-01.png')).convert('RGBA')
W,H=big.size; em=big.crop((0,0,W,int(H*0.625)))
bb=Image.new('RGBA',em.size,(255,255,255,255)); diff=Image.eval(Image.alpha_composite(bb,em).convert('L'),lambda v:255 if v<245 else 0)
em=em.crop(diff.getbbox()); em.thumbnail((2400,2400),Image.LANCZOS); em.save(os.path.join(out,'brand','mahela-emblem-hires.png'),optimize=True)
manifest.append({'file':'brand/mahela-emblem-hires.png','category':'brand','width':em.width,'height':em.height,'transparent':False,'wp_id':None,'wp_url':None,'wp_title':'Emblem cropped from Primary-logo-POPI-01.png','alt':'Mahela Group elephant emblem'})
json.dump(manifest,open(os.path.join(out,'manifest.json'),'w'),indent=1,ensure_ascii=False)
