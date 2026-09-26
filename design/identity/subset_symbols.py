"""Subset the OFL Noto Emoji source to game-owned strings, never player data."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
import json,hashlib
ROOT=Path(__file__).resolve().parents[2]
s=''.join((ROOT/f).read_text() for f in ['main.js','index.html','game-progress.mjs','garage-content.mjs','garage-visuals.mjs'])
font=TTFont('/tmp/tank-NotoEmoji.ttf');cmap=font.getBestCmap();points=sorted({ord(c) for c in s if ord(c) in cmap and ord(c)>127}|{0x20,0xfe0f,0xfe0e,0x200d})
opts=subset.Options();opts.name_IDs=['*'];opts.name_legacy=True;opts.name_languages=['*'];sub=subset.Subsetter(options=opts);sub.populate(unicodes=points);sub.subset(font)
# Rename modified subset; preserve original copyright and license name table entries.
for n in font['name'].names:
 if n.nameID in (1,4,6):n.string='Field Symbols'.encode(n.getEncoding())
 if n.nameID in (2,17):n.string='Regular'.encode(n.getEncoding())
font.flavor=None;out=ROOT/'assets/fonts/field-symbols.ttf';font.save(out)
(ROOT/'legal/evidence/symbol-subset.json').write_text(json.dumps({'source':'https://github.com/google/fonts/tree/main/ofl/notoemoji','sourceSha256':hashlib.sha256(Path('/tmp/tank-NotoEmoji.ttf').read_bytes()).hexdigest(),'fontTools':__import__('fontTools').__version__,'file':str(out.relative_to(ROOT)),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'codepoints':[f'U+{n:04X}' for n in points]},indent=2)+'\n')
print(len(points),'symbols',out.stat().st_size,'bytes')
