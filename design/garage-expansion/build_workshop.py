"""Original accessories, physical projectile cosmetics and four themed crates."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
helpers=(ROOT/'design/armored-update/build_armored_fleet.py').read_text().split('\nmanifest=[]')[0]
exec(helpers.replace("SCENE='05_Armored_Fleet'","SCENE='07_Garage_Workshop'"))
white=mat('Snow',(.84,.93,1),0,.8)
black=mat('BallSeams',(.012,.018,.022),0,.85)
orange=mat('BasketLeather',(.82,.25,.035),0,.87)
yellow=mat('TennisFelt',(.59,.83,.035),0,.94)
gold=mat('TrophyGold',(.85,.55,.12),.8,.29)
ice=mat('Ice',(.09,.62,.88),.45,.2,.18)
hot=mat('Lava',(.86,.095,.013),.35,.36,.7)
neon=mat('Neon',(.08,.85,.65),.45,.25,.5)
blue=mat('SportBlue',(.025,.17,.63),.25,.5)

def sphere(name,loc,r,m,scale=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=10,radius=r,location=loc)
    o=bpy.context.object;o.name=name
    if scale:o.scale=scale
    o.data.materials.append(m)
    for p in o.data.polygons:p.use_smooth=True
    made.append(o);return o
def ico(name,loc,r,m,sub=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub,radius=r,location=loc)
    o=bpy.context.object;o.name=name;o.data.materials.append(m);made.append(o);return o
def cone(name,loc,r,h,m,tip=0):
    bpy.ops.mesh.primitive_cone_add(vertices=8,radius1=r,radius2=tip,depth=h,location=loc)
    o=bpy.context.object;o.name=name;o.data.materials.append(m);made.append(o);return o
def ring(name,loc,R,r,m,rot=None):
    bpy.ops.mesh.primitive_torus_add(major_segments=24,minor_segments=6,location=loc,major_radius=R,minor_radius=r)
    o=bpy.context.object;o.name=name
    if rot:o.rotation_euler=rot
    o.data.materials.append(m);made.append(o);return o

manifest=[]
for idx,kind in enumerate(['dragonhelm','championcup','icecrown','holodrone','turbopack','rallyrack']):
    made=[]
    if kind=='dragonhelm':
        tapered('Helmet',.02,.29,(.71,.61),(.43,.46),0,metal)
        for s in [-1,1]:
            o=cone('Horn',(s*.33,-.10,.40),.115,.49,gold);o.rotation_euler.y=s*.4
            cube('Eye',(s*.16,.255,.22),(.15,.025,.045),hot,.01)
        for j in range(3):cone('Crest',(0,-.18+j*.16,.37),.08,.23,gold)
    if kind=='championcup':
        cube('Plinth',(0,0,.06),(.44,.39,.12),metal,.025)
        cyl('Stem',(0,0,.25),.065,.31,gold)
        cone('Cup',(0,0,.52),.12,.34,gold,.25)
        ring('Lip',(0,0,.69),.245,.027,gold)
        for s in [-1,1]:ring('Handle',(s*.25,0,.52),.13,.035,gold,(math.pi/2,0,0))
    if kind=='icecrown':
        ring('Crown',(0,0,.10),.30,.07,metal)
        for j in range(7):
            a=j*math.tau/7;o=cone('IceShard',(.26*math.cos(a),.26*math.sin(a),.31),.085,.49 if j%2 else .35,ice)
            o.rotation_euler.y=.14*math.cos(a)
    if kind=='holodrone':
        cyl('Dock',(0,0,.045),.25,.09,metal,n=16)
        cyl('HoloBeam',(0,0,.26),.035,.36,neon,n=8)
        cube('Drone',(0,0,.51),(.37,.31,.17),metal,.04)
        cube('Eye',(0,.168,.51),(.21,.019,.065),neon,.015)
        for s in [-1,1]:
            cube('Arm',(s*.25,0,.52),(.23,.075,.055),edge,.013)
            ring('Rotor',(s*.40,0,.53),.15,.025,neon)
    if kind=='turbopack':
        cube('TurboRack',(0,0,.06),(.87,.39,.12),metal,.025)
        for s in [-1,1]:
            cyl('Turbine',(s*.25,0,.29),.18,.48,edge,'Y',16)
            cyl('Exhaust',(s*.25,-.25,.29),.139,.03,black,'Y',16)
            cyl('Core',(s*.25,-.27,.29),.083,.02,neon,'Y',12)
            for j in range(3):cube('CoolingFin',(s*.25,-.13+j*.13,.46),(.21,.037,.045),metal,.004)
    if kind=='rallyrack':
        for x in [-.29,.29]:cube('Mount',(x,0,.09),(.06,.18,.18),metal,.009)
        cube('Bar',(0,0,.22),(.81,.13,.08),edge,.015)
        for x in [-.29,-.10,.10,.29]:
            cyl('Lamp',(x,0,.32),.09,.13,metal,'Y',12)
            cyl('Lens',(x,.075,.32),.066,.016,white,'Y',12)
    root,entry=group_export('acc_'+kind,made);entry['kind']='accessory';manifest.append(entry);root.location=(idx*1.65,0,0)

for idx,kind in enumerate(['snowball','football','basketball','tennisball','beachball','meteor','crystalshot','plasmacore']):
    made=[]
    if kind=='snowball':
        ico('Snowball',(0,0,0),1,white,2)
        for p in [(0,.86,.25),(.58,.15,.69),(-.57,-.51,.40)]:ico('SnowClump',p,.23,white,1)
    if kind=='football':
        sphere('Football',(0,0,0),1,white)
        phi=(1+math.sqrt(5))/2
        points=[(0,s,t*phi) for s in [-1,1] for t in [-1,1]]+[(s,t*phi,0) for s in [-1,1] for t in [-1,1]]+[(s*phi,0,t) for s in [-1,1] for t in [-1,1]]
        # Thin curved pentagonal patches; all merged into one black mesh.
        for p in points:
            n=Vector(p).normalized();u=n.cross(Vector((0,0,1)))
            if u.length<.01:u=n.cross(Vector((0,1,0)))
            u.normalize();v=n.cross(u);verts=[tuple(n*1.06)]
            for j in range(5):verts.append(tuple((n+u*(.36*math.cos(j*math.tau/5))+v*(.36*math.sin(j*math.tau/5))).normalized()*1.06))
            mesh=bpy.data.meshes.new('Panel');mesh.from_pydata(verts,[],[(0,j+1,(j+1)%5+1) for j in range(5)]);mesh.update()
            o=bpy.data.objects.new('Pentagon',mesh);scene.collection.objects.link(o);o.data.materials.append(black);made.append(o)
    if kind=='basketball':
        sphere('Basketball',(0,0,0),1,orange)
        for rot in [(0,0,0),(math.pi/2,0,0),(0,math.pi/2,0)]:ring('Seam',(0,0,0),.991,.024,black,rot)
    if kind=='tennisball':
        sphere('TennisBall',(0,0,0),1,yellow)
        for a in [-.62,.62]:ring('Seam',(0,0,a),math.sqrt(1-a*a),.031,white)
    if kind=='beachball':
        o=sphere('BeachBall',(0,0,0),1,white)
        for m in [blue,hot,gold]:o.data.materials.append(m)
        for p in o.data.polygons:
            c=sum((o.data.vertices[i].co for i in p.vertices),Vector())/len(p.vertices);a=math.atan2(c.y,c.x);p.material_index=int((a+math.pi+.035)/math.tau*8)%4
        # Calculate centers before assigning panels (mesh may be lazy after creation).
        o.data.update()
    if kind=='meteor':
        ico('Meteor',(0,0,0),.96,metal,2)
        for p in [(.52,.41,.64),(-.63,.45,.36),(.12,-.75,.42),(.4,-.12,-.79)]:ico('HotCrystal',p,.27,hot,1)
    if kind=='crystalshot':
        cone('Crystal',(0,0,.25),.64,1.40,ice);cone('CrystalBase',(0,0,-.58),0,.26,ice,.64)
        for x in [-.49,.49]:cone('SatelliteCrystal',(x,0,0),.24,.91,white)
    if kind=='plasmacore':
        ico('Core',(0,0,0),.66,neon,2)
        for rot in [(0,0,0),(math.pi/2,0,0),(0,math.pi/2,0)]:ring('Containment',(0,0,0),.9,.055,edge,rot)
    root,entry=group_export('shot_'+kind,made);entry['kind']='projectile';manifest.append(entry);root.location=(idx*2.6,3,1.1)

for idx,(kind,accent) in enumerate([('forge',hot),('stadium',gold),('arcticlab',ice),('neonlab',neon)]):
    made=[]
    cube('Case',(0,0,.53),(1.55,1.10,1.02),metal,.10)
    cube('Lid',(0,0,1.06),(1.61,1.16,.20),paint,.065)
    for x in [-.59,.59]:
        cube('Brace',(x,0,.57),(.12,1.14,1.10),edge,.025)
        cube('LidStripe',(x,0,1.17),(.16,1.18,.018),accent,.004)
    cube('Latch',(0,.584,.81),(.23,.09,.32),gold,.023)
    cube('Badge',(0,.563,.42),(.74,.04,.47),black,.025)
    if kind=='forge':
        for x in [-.20,0,.20]:cube('Claw',(x,.597,.42),(.08,.018,.32),hot,.012,(0,.2,0))
    if kind=='stadium':
        cyl('BallBadge',(0,.60,.42),.18,.024,white,'Y',12)
        cyl('Pentagon',(0,.62,.42),.079,.017,black,'Y',5)
    if kind=='arcticlab':
        for a in [0,math.pi/3,-math.pi/3]:cube('CrystalEmblem',(0,.60,.42),(.055,.02,.35),ice,.004,(0,a,0))
    if kind=='neonlab':
        for x in [-.22,0,.22]:cube('Circuit',(x,.60,.42),(.075,.02,.31),neon,.005)
    root,entry=group_export('crate_'+kind,made);entry['kind']='crate';manifest.append(entry);root.location=(idx*2.5,6.2,0)

scene['notes']='Original cosmetic-only workshop. Projectiles exported centred at origin; accessories start at the mounting plane.'
bpy.data.libraries.write(str(ROOT/'design/garage-expansion/Garage-Workshop.blend'),{scene},path_remap='RELATIVE',fake_user=True)
(ROOT/'design/garage-expansion/manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest))
