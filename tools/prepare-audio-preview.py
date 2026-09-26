"""Build private, local-only audition assets from the user's AudioHero ZIPs.

No network requests, source uploads, or license approval. All audio and provenance
stay in the ignored .local-audio directory; normal builds never include them.
"""
import array
import hashlib
import json
import math
from pathlib import Path
import subprocess
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / '.local-audio'
SOURCE = PRIVATE / 'source'
OUT = PRIVATE / 'preview'
PACKS = ['Darkwave & Industrial Pulse', 'The Quiet Between Stars',
         'Neuromancers Dreams', 'Explosions Zone', 'Game Developer SFX', 'Mechanical']


def run(*args):
    return subprocess.run(args, check=True, capture_output=True)


def probe(file):
    return json.loads(run('ffprobe', '-v', 'error', '-show_entries',
                         'format=duration:format_tags', '-of', 'json', str(file)).stdout)['format']


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    inventory = []
    for pack in PACKS:
        with ZipFile(Path.home() / 'Downloads' / (pack + '.zip')) as archive:
            for entry in archive.infolist():
                member = Path(entry.filename)
                if member.is_absolute() or '..' in member.parts or entry.file_size > 100_000_000:
                    raise ValueError('Unsafe ZIP member')
                if member.suffix.lower() != '.mp3' or member.parts[0] == '__MACOSX':
                    continue
                dst = SOURCE / member
                dst.parent.mkdir(parents=True, exist_ok=True)
                dst.write_bytes(archive.read(entry))
                meta = probe(dst)
                inventory.append(dict(pack=pack, file=str(member), duration=float(meta['duration']), tags=meta.get('tags', {})))
    (PRIVATE / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2))

    # Exact publisher filenames; choices based on supplied descriptions, not a claim of listening.
    choices = [
        ('menu', 'AAM532_11_DeepNotion_Bed.mp3', 'music', 0, None),
        ('garage', 'AAM532_54_NeonDreams_NoDrms.mp3', 'music', 0, None),
        ('battle', '52-Micro-Pulse-ALT-SM505.mp3', 'music', 0, None),
        ('battle-alt', 'AAM533_25_DeepRealm_Bed.mp3', 'music', 0, None),
        ('fire-a', 'ConcussionHitSetI EXP014605.mp3', 'sfx', None, .48),
        ('fire-b', '1x2OzBlackPowderB EXP013604.mp3', 'sfx', None, .48),
        ('impact-a', 'MetalImpactsLowLar FS012301.mp3', 'sfx', None, .38),
        ('impact-b', 'HitsImpacts EC09_48_2.mp3', 'sfx', None, .38),
        ('bounce', 'METAL-HIT_GEN-HDF-17085.mp3', 'sfx', None, .24),
        ('destroy-a', 'ExplosionHugeFast SDT025201.mp3', 'sfx', None, 1.45),
        ('destroy-b', 'ExploLowFireDest SDT2021805.mp3', 'sfx', None, 1.35),
        ('ui', 'MechanismAutoLoad HIT028602.mp3', 'sfx', None, .11),
        ('equip', 'MechanicalRatchets MM029303.mp3', 'sfx', None, .34),
        ('engine', 'MotorGear 6054_98.mp3', 'engine', 6, 4),
    ]
    manifest = dict(version=1, licenseStatus='pending-local-preview', tracks={}, cues={
        'fire':['fire-a', 'fire-b'], 'impact':['impact-a','impact-b'],
        'bounce':['bounce'], 'destroy':['destroy-a','destroy-b'], 'ui':['ui'],
        'equip':['equip'], 'engine':['engine'],
    }, music={'menu':['menu'], 'garage':['garage'], 'battle':['battle','battle-alt'], 'result':['menu']})
    evidence = []
    for key, filename, kind, start, duration in choices:
        rows = [r for r in inventory if Path(r['file']).name == filename]
        if len(rows) != 1:
            raise ValueError('Missing or ambiguous source: ' + filename)
        row = rows[0]; src = SOURCE / row['file']
        output = OUT / (key + ('.m4a' if kind == 'music' else '.wav'))
        if kind == 'music':
            duration = row['duration']
            base = f'highpass=f=45,lowpass=f=8000,afade=t=in:d=1.5,afade=t=out:st={max(0,duration-2)}:d=2'
            report = run('ffmpeg','-hide_banner','-i',str(src),'-af',base+',loudnorm=I=-23:TP=-3:LRA=9:print_format=json','-f','null','-').stderr.decode()
            measurement = json.loads(report[report.rfind('{'):report.rfind('}')+1])
            norm = 'loudnorm=I=-23:TP=-3:LRA=9:linear=true:' + ':'.join([
                'measured_I='+measurement['input_i'], 'measured_TP='+measurement['input_tp'],
                'measured_LRA='+measurement['input_lra'], 'measured_thresh='+measurement['input_thresh'],
                'offset='+measurement['target_offset']])
            filters = base + ',' + norm
            args = ['-c:a','aac','-b:a','128k','-ac','2']
        else:
            if start is None:
                pcm = run('ffmpeg','-v','error','-i',str(src),'-f','f32le','-ac','1','-ar','12000','-').stdout
                samples = array.array('f',pcm)
                windows = [math.sqrt(sum(v*v for v in samples[i:i+96])/96) for i in range(0,len(samples)-96,96)]
                threshold = max(windows)*.12
                onset = next((i for i,v in enumerate(windows) if v >= threshold),0)*.008
                start = max(0,onset-.008)
            # Short envelopes avoid long cinematic tails and leave mix headroom.
            cutoff = 650 if kind == 'engine' else 1700 if key in ('ui','equip') else 5200
            base = f'atrim=start={start}:duration={duration},asetpts=PTS-STARTPTS,highpass=f=55,lowpass=f={cutoff}'
            pcm = run('ffmpeg','-v','error','-i',str(src),'-af',base,'-f','f32le','-ac','1','-ar','24000','-').stdout
            samples = array.array('f',pcm); peak = max(abs(v) for v in samples)
            gain = (10**((-14 if kind=='engine' else -8)/20))/max(peak,.00001)
            filters = base + f',volume={gain},afade=t=in:d=0.004,afade=t=out:st={max(0,duration-.10)}:d=0.10'
            args = ['-c:a','pcm_s16le','-ac','1']
        run('ffmpeg','-v','error','-y','-i',str(src),'-af',filters,'-ar','44100','-map_metadata','-1',*args,str(output))
        title = row['tags'].get('title',filename[:-4])
        manifest['tracks'][key] = dict(url='/_audio-preview/'+output.name,title=title,kind=kind,duration=round(duration,3))
        evidence.append(dict(id=key,pack=row['pack'],source=row['file'],title=title,description=row['tags'].get('comment',''),
            sourceSha256=hashlib.sha256(src.read_bytes()).hexdigest(),output=output.name,
            sha256=hashlib.sha256(output.read_bytes()).hexdigest(),filters=filters,
            sourceMetadata=row['tags'],release=False,licenseStatus='pending-local-preview'))
        print(key, '->', output.name, round(output.stat().st_size/1024), 'KiB', flush=True)
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    (PRIVATE/'selection.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2))
    print('Local preview only:',len(choices),'assets. Source audio remains private.')


if __name__ == '__main__':
    build()
