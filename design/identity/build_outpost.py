"""Original expedition repair yard. Geometry/materials created here; no external art."""
import bpy, math, random
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
random.seed(260926)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.name='Expedition_Outpost'
def mat(name,col,metal=0,rough=.6,glow=0,noise=False):
 m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True;n=m.node_tree.nodes;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 if glow:p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=glow
 if noise:
  t=n.new('ShaderNodeTexNoise');t.inputs['Scale'].default_value=3;t.inputs['Detail'].default_value=4;b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.3;b.inputs['Distance'].default_value=.12;m.node_tree.links.new(t.outputs['Fac'],b.inputs['Height']);m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
 return m
stone=mat('Stratified sandstone',(.31,.20,.12),rough=.94,noise=True)
stonefar=mat('Distant warm stone',(.34,.30,.24),rough=1)
steel=mat('Graphite steel',(.055,.075,.065),.65,.42,noise=True)
concrete=mat('Weathered service concrete',(.17,.19,.15),.08,.86,noise=True)
olive=mat('Field equipment',(.22,.28,.11),.4,.53)
copper=mat('Copper edges',(.48,.23,.095),.62,.42)
stripe=mat('Ivory markings',(.71,.73,.51),.1,.7)
lamp=mat('Chartreuse guide lights',(.6,.91,.14),.2,.25,3)
window=mat('Warm windows',(.85,.57,.25),.1,.3,2)
black=mat('Rubber',(.013,.02,.016),rough=.9)
def box(name,loc,dims,m,bevel=.05,rot=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.rotation_euler.z=rot;o.data.materials.append(m)
 if bevel:q=o.modifiers.new('Fabricated edge','BEVEL');q.width=bevel;q.segments=2;o.modifiers.new('Corner normals','WEIGHTED_NORMAL')
 return o
def rod(name,a,b,r,m,vertices=10):
 mid=(Vector(a)+Vector(b))/2;d=Vector(b)-Vector(a);bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=d.length,location=mid);o=bpy.context.object;o.name=name;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();o.data.materials.append(m);return o
box('Bedrock floor',(0,0,-.5),(140,150,1),stone)
box('Service apron',(0,-2,-.12),(45,30,.4),concrete)
# Concrete seams, wheel rails and broken guide lines give a functional repair yard.
for x in range(-24,25,4):box('Concrete joint',(x,-3,.09),(.025,27,.012),black,0)
for y in range(-16,14,4):box('Concrete joint',(0,y,.09),(46,.025,.012),black,0)
for x in [-5,5]:
 box('Service rail',(x,-3,.11),(.20,13,.12),steel)
 for y in range(-11,7,3):box('Apron marking',(x*1.4,y,.103),(.14,1.2,.014),stripe,0)
for x in [-9,9]:
 for y in [-9,-3,3]:box('Ground guide',(x,y,.14),(.45,.10,.10),lamp,.02)
# Workshop and canopy, asymmetrical silhouette.
box('Repair workshop',(-16,12,2.6),(12,8,5.2),steel,.18)
for x in [-20,-16,-12]:
 box('Bay opening',(x,7.96,2.1),(3.2,.08,3.9),black)
 box('Door sill',(x,7.8,.12),(3.4,1,.15),copper)
 for z in [1,1.8,2.6,3.4]:box('Slatted door',(x,7.86,z),(3.05,.06,.04),concrete,.01)
 box('Bay lamp',(x,7.6,4.35),(2.4,.15,.13),window,.02)
for x in [-22,-10]:rod('Canopy support',(x,3,0),(x,3,6),.15,steel)
box('Solar canopy',(-16,7,6.1),(14,11,.23),steel)
for x in range(-22,-9,2):
 for y in [4,7,10]:box('Solar module',(x,y,6.26),(1.8,2.7,.055),olive,.01)
for i in range(6):box('Roof spine',(-22+i*2.4,7,6.37),(.07,11,.1),copper,.01)
# Right-hand power unit, stacks and a tripod surveying mast.
box('Power container',(16,11,1.8),(6,8,3.6),olive,.12)
for y in range(8,15):box('Container rib',(12.97,y,1.8),(.07,.13,3.4),copper,.015)
for x,y in [(11,5),(15,5),(18,6)]:
 box('Supplies',(x,y,.65),(2.2,1.7,1.3),steel,.1)
 for dx in [-.7,.7]:box('Cargo clasp',(x+dx,y,.66),(.09,1.76,1.34),stripe,.015)
for dx,dy in [(-1.8,0),(1.8,0),(0,2.2)]:rod('Mast tripod',(13+dx,18+dy,0),(13,18,12),.11,steel)
rod('Mast pole',(13,18,8),(13,18,19),.13,copper)
for z in [13,15,17]:rod('Signal dipole',(11.5,18,z),(14.5,18,z),.065,stripe)
box('Mast beacon',(13,18,19.1),(.26,.26,.35),lamp)
# Layered eroded rock towers built from seeded primitive geometry.
for i in range(32):
 x=-75+i*4.8;y=random.uniform(32,65);h=random.uniform(8,26);radius=random.uniform(4,8)
 for k in range(3):
  bpy.ops.mesh.primitive_cone_add(vertices=random.choice([5,6,7]),radius1=radius*(1-.12*k),radius2=radius*(.85-.14*k),depth=h/3,location=(x,y,k*h/3+h/6-.2))
  o=bpy.context.object;o.name='Eroded escarpment';o.rotation_euler.z=random.random();o.data.materials.append(stone if y<44 else stonefar)
# Low industrial bollards, no brands or licensed emblems.
for x in [-11,11]:
 for y in [-6,2,9]:
  box('Safety bollard',(x,y,.48),(.35,.35,.96),steel)
  box('Bollard stripe',(x,y,.77),(.37,.37,.12),stripe,.02)
world=bpy.data.worlds.new('Outpost sky');world.use_nodes=True;scene.world=world
n=world.node_tree.nodes;sky=n.new('ShaderNodeTexSky');sky.sky_type='SINGLE_SCATTERING';sky.sun_elevation=.18;sky.sun_rotation=2.1;sky.altitude=.2;sky.air_density=1.3
world.node_tree.links.new(sky.outputs[0],n.get('Background').inputs['Color']);n.get('Background').inputs['Strength'].default_value=.25
bpy.ops.object.light_add(type='SUN',location=(0,0,30));sun=bpy.context.object;sun.rotation_euler=(.55,-.4,-.6);sun.data.energy=2.2;sun.data.angle=.13;sun.data.color=(1,.77,.49)
bpy.ops.object.light_add(type='AREA',location=(0,-5,15));bpy.context.object.data.energy=2000;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=20
bpy.ops.object.camera_add(location=(19,-34,9));cam=bpy.context.object;cam.rotation_euler=(Vector((0,9,3))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=34;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=1800;scene.render.resolution_y=1120;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=90
scene.view_settings.view_transform='AgX';scene.render.filepath=str(ROOT/'assets/outpost-lobby.jpg')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'design/identity/Expedition-Outpost.blend'))
bpy.ops.render.render(write_still=True)
# Downsample verified HDR inputs, preserving linear HDR light for runtime.
for inp,out in [('/tmp/tank-audit-outdoor.hdr','env.hdr'),('/tmp/tank-audit-studio.hdr','env_studio.hdr')]:
 im=bpy.data.images.load(inp);im.scale(256,128);im.filepath_raw=str(ROOT/'assets'/out);im.file_format='HDR';im.save()
 if out=='env.hdr':
  im=bpy.data.images.load(inp,check_existing=False);scene.render.image_settings.file_format='JPEG';im.save_render(str(ROOT/'assets/sky.jpg'),scene=scene)
print('Original outpost and verified HDR exports completed.')
