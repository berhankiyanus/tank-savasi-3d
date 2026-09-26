import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
SCENE='05_Armored_Fleet'
if SCENE in bpy.data.scenes: bpy.data.scenes[SCENE].name = SCENE + '_Incomplete'
scene=bpy.data.scenes.new(SCENE); bpy.context.window.scene=scene

def mat(name,col,metal=0,rough=.5,glow=0):
    # Keep unique names during authoring; export material names standardized below.
    m=bpy.data.materials.new('V2_'+name);m.use_nodes=True;m.diffuse_color=(*col,1)
    n=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    n.inputs['Base Color'].default_value=(*col,1);n.inputs['Metallic'].default_value=metal;n.inputs['Roughness'].default_value=rough
    if glow:n.inputs['Emission Color'].default_value=(*col,1);n.inputs['Emission Strength'].default_value=glow
    return m
paint=mat('TankPaint',(.22,.31,.17),.3,.48)
edge=mat('ArmorEdges',(.31,.37,.31),.5,.42)
metal=mat('RunningGear',(.065,.083,.085),.7,.38)
rubber=mat('TankTracks',(.025,.032,.033),.1,.83)
light=mat('Optics',(.15,.72,.8),.25,.22,.5)
decal=mat('Markings',(.79,.72,.49),.15,.7)
rescue=mat('RescueTeal',(.07,.55,.40),.1,.65)
canvas=mat('Canvas',(.34,.39,.25),0,.94)
made=[]
def cube(name,loc,dim,m,bevel=.025,rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dim
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if rot:o.rotation_euler=rot
    o.data.materials.append(m)
    if bevel:
        mod=o.modifiers.new('Armor bevel','BEVEL');mod.width=bevel;mod.segments=1
        bpy.ops.object.modifier_apply(modifier=mod.name)
    made.append(o);return o

def cyl(name,loc,r,depth,m,axis='Z',n=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=n,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=name
    if axis=='X':o.rotation_euler.y=math.pi/2
    if axis=='Y':o.rotation_euler.x=math.pi/2
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);made.append(o);return o

def tapered(name,z0,z1,lower,upper,cy,m):
    vs=[(x*w/2,y*l/2+cy,z) for z,w,l in [(z0,*lower),(z1,*upper)] for x,y in [(-1,-1),(1,-1),(1,1),(-1,1)]]
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vs,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);mesh.update()
    o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);o.data.materials.append(m);made.append(o);return o

def group_export(id,objects):
    # Merge by material to keep the detailed geometry to a few draw calls.
    root=bpy.data.objects.new(id,None);scene.collection.objects.link(root)
    batches={}
    for o in objects: batches.setdefault((o.data.materials[0], bool(o.get('turret'))),[]).append(o)
    turret=bpy.data.objects.new('TankTurret',None);scene.collection.objects.link(turret);turret.parent=root
    for (m,moving),batch in batches.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in batch:o.select_set(True)
        bpy.context.view_layer.objects.active=batch[0];bpy.ops.object.join();o=bpy.context.object
        o.name=id+'_'+m.name.replace('V2_','');scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR');o.parent=turret if moving else root
    bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
    for o in root.children_recursive:o.select_set(True)
    path=ROOT/'assets'/f'{id}.glb'
    bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,use_active_scene=True,export_yup=True,export_apply=True)
    # Material identifiers are part of the game's paint/track customization contract.
    data=bytearray(path.read_bytes());import struct
    length=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+length]);
    for m in g.get('materials',[]):
        if m['name'].startswith('V2_'):m['name']=m['name'][3:].split('.')[0]
    js=json.dumps(g,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
    rest=data[20+length:];out=bytearray(b'glTF'+struct.pack('<II',2,20+len(js)+len(rest))+struct.pack('<I',len(js))+b'JSON'+js+rest);path.write_bytes(out)
    tris=0
    meshes=[o for o in root.children_recursive if o.type=='MESH']
    for o in meshes:o.data.calc_loop_triangles();tris+=len(o.data.loop_triangles)
    entry={'id':id,'triangles':tris,'meshes':len(meshes),'bytes':path.stat().st_size}
    return root,entry

manifest=[]
for idx,(kind,w,length,turret,barrel,top) in enumerate([
    ('recruit',2.05,3.25,1.30,1.20,1.73),
    ('scout',1.86,3.40,1.03,1.40,1.62),
    ('heavy',2.36,3.60,1.62,1.24,1.94)]):
    made=[]
    # Running gear: segmented track belt, six road wheels per side, exposed hubs.
    for side in [-1,1]:
        x=side*w*.47
        cube('TrackCore',(x,0,.47),(.39,length,.68),rubber,.14)
        for i in range(6):
            y=-length*.39+i*length*.156
            cyl('RoadWheel',(x+side*.205,y,.47),.27,.12,metal,'X',12)
            cyl('Hub',(x+side*.277,y,.47),.112,.022,edge,'X',10)
        for i in range(15):
            y=-length*.47+i*length*.94/14
            for z in [.12,.82]:cube('Tread',(x,y,z),(.47,.125,.075),metal,.006)
        for y in [-length*.5,length*.5]:cube('EndTread',(x,y,.46),(.47,.09,.52),rubber,.03)
        cube('Fender',(x,0,.92),(.51,length*.99,.10),paint,.03)
    tapered('SlopedHull',.54,1.12,(w*.82,length*.91),(w*.72,length*.66),0,paint)
    cube('EngineDeck',(0,-length*.34,1.08),(w*.64,.63,.15),metal,.03)
    for x in [-.42,-.28,-.14,0,.14,.28,.42]:cube('Vent',(x,-length*.34,1.165),(.055,.43,.02),edge,.004)
    for x in [-w*.32,w*.32]:
        cube('HeadlightHousing',(x,length*.34,1.03),(.21,.13,.14),metal,.018)
        cube('Headlight',(x,length*.365,1.04),(.15,.014,.065),light,.004)
        cyl('TowEye',(x,length*.43,.66),.08,.065,edge,'Y',10)
    turret_start=len(made)
    cyl('TurretRing',(0,-.14,1.16),turret*.46,.15,metal,n=20)
    tapered('Turret',1.20,top,(turret,turret*1.12),(turret*.76,turret*.81),-.13,paint)
    for side in [-1,1]:
        cube('CheekArmor',(side*turret*.46,.0,(1.2+top)/2),(.14,turret*.72,.28),edge,.025)
        for j in range(3):
            cyl('SmokeLauncher',(side*(turret*.49+.06),-.35+j*.14,top-.12),.044,.22,metal,'Y',8)
    cyl('Hatch',(0,-.28,top+.035),turret*.24,.07,metal,n=16)
    cyl('HatchLid',(0,-.28,top+.08),turret*.20,.03,paint,n=16)
    cube('Periscope',(.27,-.18,top+.10),(.19,.17,.12),metal,.015)
    cube('Optic',(.27,-.087,top+.115),(.13,.015,.04),light,.003)
    gunZ=(1.2+top)/2
    cube('Mantlet',(0,turret*.46,gunZ),(.45,.35,.32),metal,.045)
    # A horizontal cannon, with muzzle centred at the existing 2.6-unit shot origin.
    gunStart=turret*.45;gunEnd=2.60
    cyl('Cannon',(0,(gunStart+gunEnd)/2,gunZ),.07 if kind=='scout' else .10,gunEnd-gunStart,metal,'Y',12)
    cyl('BarrelSleeve',(0,gunStart+.24,gunZ),.135,.50,paint,'Y',12)
    cube('MuzzleBrake',(0,2.53,gunZ),(.24,.28,.20),edge,.025)
    cube('Bore',(0,2.674,gunZ),(.12,.008,.10),rubber,.0)
    for side in [-1,1]:cube('MuzzleVent',(side*.123,2.51,gunZ),(.008,.14,.06),rubber,0)
    cyl('AntennaBase',(-.38,-.48,top+.06),.055,.1,metal)
    cyl('Antenna',(-.38,-.48,top+.38),.012,.57,metal,n=6)
    for o in made[turret_start:]:o['turret']=True
    for side in [-1,1]:
        cube('Stowage',(side*w*.30,-length*.36,1.26),(.31,.40,.27),canvas,.035)
        cube('Strap',(side*w*.30,-length*.36,1.405),(.055,.405,.017),metal,.002)
    # Physical recognition marks; no decal textures or extra downloads.
    for i in range(2 if kind=='scout' else 3):cube('RecognitionStripe',(-.19+i*.15,length*.24,1.128),(.045,.24,.014),decal,.002)
    if kind=='heavy':
        for side in [-1,1]:
            for j in range(4):cube('ReactiveArmor',(side*w*.48,-.91+j*.59,1.02),(.19,.48,.29),paint,.018)
    root,entry=group_export('tank_'+kind+'_mk2',made);manifest.append(entry);root.location.x=(idx-1)*5.6

# Three matching, exclusively cosmetic equipment pieces.
for idx,kind in enumerate(['rescuepack','cargorack','searchlight']):
    made=[]
    if kind=='rescuepack':
        cube('MedicalCase',(0,0,.22),(.67,.40,.44),canvas,.06)
        for x in [-.22,.22]:cube('Buckle',(x,0,.452),(.065,.43,.025),metal,.006)
        cube('Patch',(0,.213,.23),(.23,.016,.22),decal,.01)
        cube('RescueBandage',(0,.225,.23),(.16,.012,.075),rescue,.014,rot=(0,.5,0))
        for x in [-.045,.045]:cube('BandageStitch',(x,.234,.23),(.01,.005,.035),decal,.001)
        cube('Handle',(0,0,.51),(.22,.05,.075),metal,.015)
    if kind=='cargorack':
        cube('Rack',(0,0,.055),(.85,.50,.11),metal,.02)
        for x in [-.25,.25]:
            cube('CargoBox',(x,0,.24),(.34,.41,.31),paint,.035)
            cube('Latch',(x,.214,.25),(.06,.02,.11),decal,.007)
        for x in [-.41,.41]:cube('Rail',(x,0,.28),(.035,.52,.33),edge,.008)
    if kind=='searchlight':
        cyl('Base',(0,0,.05),.21,.10,metal,n=16);cyl('Stem',(0,0,.21),.06,.30,edge)
        cyl('LampHousing',(0,0,.47),.21,.24,metal,'Y',16)
        cyl('Lens',(0,.127,.47),.17,.018,light,'Y',16)
        for x in [-.12,0,.12]:cube('Guard',(x,.151,.47),(.016,.025,.32),edge,.003)
    root,entry=group_export('acc_'+kind,made);manifest.append(entry);root.location=(idx*1.7-1.7,5,0)

scene['notes']='Original redesigned tank fleet. Existing gameplay stats remain unchanged. Exported at origin before gallery layout.'
bpy.data.libraries.write(str(ROOT/'design/armored-update/Armored-Fleet.blend'),{scene},path_remap='RELATIVE',fake_user=True)
(ROOT/'design/armored-update/manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest))
