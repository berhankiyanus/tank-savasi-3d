# Run through Blender MCP in the interactive application. Existing scenes are preserved.
import bpy, math, json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
name = '04_Saha_Telsizi'
scene = bpy.data.scenes.get(name)
assert scene is None or len(scene.objects) == 0, 'Design already has objects; inspect before rebuilding.'
scene = scene or bpy.data.scenes.new(name)
bpy.context.window.scene = scene

def material(name, color, metallic=0, rough=.6, glow=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = rough
    if glow:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = glow
    return m
paint = material('Radio_Olive', (.24,.33,.25), .25)
metal = material('Radio_Gunmetal', (.075,.11,.12), .65, .4)
gold = material('Radio_Brass', (.68,.46,.18), .6, .38)
glass = material('Glow_RadioScreen', (.12,.75,.60), .15, .3, .4)

def cube(name, loc, size, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object; obj.name=name; obj.dimensions=size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod=obj.modifiers.new('Machined edges','BEVEL'); mod.width=bevel; mod.segments=1
        bpy.context.view_layer.objects.active=obj; bpy.ops.object.modifier_apply(modifier=mod.name)
    return obj

def cylinder(name, loc, radius, depth, mat, vertices=8):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj=bpy.context.object; obj.name=name; obj.data.materials.append(mat); return obj

cube('RadioBase', (0,0,.045), (.72,.48,.09), metal, .02)
cube('RadioHousing', (0,0,.22), (.64,.42,.32), paint, .035)
cube('FrontPanel', (0,-.217,.225), (.51,.018,.21), metal, .01)
cube('StatusScreen', (-.10,-.229,.255), (.23,.018,.085), glass, .006)
for x in [.105,.205]:
    knob=cylinder('TuningDial', (x,-.241,.255), .03,.035,gold,12)
    knob.rotation_euler.x=math.pi/2
for i in range(4):
    cube('Vent_%02d'%i, (-.145+i*.095,-.231,.155), (.052,.015,.024), metal)
for x in [-.24,.24]:
    cube('HandleSupport',(x,0,.412),(.042,.05,.10),metal,.007)
cube('CarryHandle',(0,0,.465),(.52,.05,.042),metal,.009)
cylinder('AntennaMount',(.225,.12,.405),.06,.07,gold,12)
cylinder('WhipAntenna',(.225,.12,.79),.014,.70,metal)
cylinder('AntennaCap',(.225,.12,1.15),.022,.032,gold)
# Group into one mesh with material slots to keep the mobile draw-call cost bounded.
bpy.ops.object.select_all(action='SELECT')
bpy.context.view_layer.objects.active=bpy.data.objects['RadioBase']
bpy.ops.object.join()
obj=bpy.context.object; obj.name='Accessory_FieldRadio'
bpy.context.scene.cursor.location=(0,0,0)
bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
obj['purpose']='Cosmetic only; no combat advantage'
obj['authoring']='Original model created for Tank Savasi, 2026-09-26'
bpy.ops.export_scene.gltf(filepath=str(root/'assets/acc_fieldradio.glb'), export_format='GLB', use_selection=True, use_active_scene=True, export_yup=True, export_apply=True)
bpy.data.libraries.write(str(root/'design/Saha-Telsizi.blend'), {scene}, path_remap='RELATIVE', fake_user=True)
obj.data.calc_loop_triangles()
info={'name':name,'mesh_count':1,'triangles':len(obj.data.loop_triangles),'materials':len(obj.data.materials),'dimensions':list(obj.dimensions),'glb_bytes':(root/'assets/acc_fieldradio.glb').stat().st_size}
(root/'design/field-radio-manifest.json').write_text(json.dumps(info,indent=2))
# Return to the recovered tank gallery after exporting the new standalone source.
bpy.context.window.scene=bpy.data.scenes['01_Tanklar']
print(json.dumps(info))
