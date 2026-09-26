"""Refine reviewed, project-authored Mk2 models. No third-party downloads.
Run in Blender. Originals remain the lightweight combat LOD.
"""
import bpy, math, json, struct, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
records=json.loads((ROOT/'legal/asset-register.json').read_text())['files']
original=bpy.context.window.scene
scene=bpy.data.scenes.new('08_Premium_Fleet')
bpy.context.window.scene=scene
manifest=[]
try:
 for idx,row in enumerate(r for r in records if r['file'].startswith('assets/tank_') and r['file'].endswith('_mk2.glb') and r['release']):
  src=ROOT/row['file'];assert row['status']=='project-authored';assert hashlib.sha256(src.read_bytes()).hexdigest()==row['sha256']
  bpy.ops.object.select_all(action='DESELECT')
  bpy.ops.import_scene.gltf(filepath=str(src))
  imported=list(bpy.context.selected_objects)
  meshobjects=[o for o in imported if o.type=='MESH']
  for o in meshobjects:
   bpy.context.view_layer.objects.active=o
   # Small manufacturing edges catch light without changing the established silhouette.
   bevel=o.modifiers.new('Premium edge machining','BEVEL');bevel.width=.014;bevel.segments=2;bevel.limit_method='ANGLE';bevel.angle_limit=.8
   bpy.ops.object.modifier_apply(modifier=bevel.name)
   for mat in o.data.materials:
    mat.use_nodes=True;bsdf=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not bsdf:continue
    n=mat.name.split('.')[0]
    rough,metal=(.46,.35) if 'Paint' in n else (.84,.06) if 'Tracks' in n else (.88,0) if 'Canvas' in n else (.22,.55) if 'Optics' in n else (.36,.7)
    bsdf.inputs['Roughness'].default_value=rough;bsdf.inputs['Metallic'].default_value=metal
   # Neutral vertex tones add modest manufacturing variation while retaining runtime paint colors.
   attr=o.data.color_attributes.new(name='WorkshopFinish',type='FLOAT_COLOR',domain='CORNER')
   for loop in o.data.loops:
    co=o.data.vertices[loop.vertex_index].co
    grain=math.sin(co.x*79+co.y*31+co.z*47)*.012
    tone=max(.78,min(1,.9+co.z*.025+grain))
    attr.data[loop.index].color=(tone,tone,tone,1)
  for o in imported:o.select_set(True)
  out=ROOT/'assets'/src.name.replace('_mk2','_premium')
  bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,use_active_scene=True,export_yup=True,export_apply=True)
  data=out.read_bytes();length=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+length])
  for mat in g.get('materials',[]):mat['name']=mat.get('name','').split('.')[0]
  js=json.dumps(g,separators=(',',':')).encode();js+=b' '*((-len(js))%4);rest=data[20+length:]
  out.write_bytes(b'glTF'+struct.pack('<II',2,20+len(js)+len(rest))+struct.pack('<I',len(js))+b'JSON'+js+rest)
  manifest.append({'file':str(out.relative_to(ROOT)),'sourceFile':row['file'],'sourceSha256':row['sha256'],'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'bytes':out.stat().st_size,'triangles':sum(len(o.data.loop_triangles) for o in meshobjects)})
  for o in imported:
   if not o.parent:o.location.x=(idx%5)*6;o.location.y=(idx//5)*7
 (ROOT/'design/premium-fleet/manifest.json').write_text(json.dumps(manifest,indent=2))
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'design/premium-fleet/Premium-Fleet.blend'),copy=True)
finally:
 bpy.context.window.scene=original
print('PREMIUM_FLEET_COMPLETE',len(manifest))
