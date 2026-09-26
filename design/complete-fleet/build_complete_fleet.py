"""Finish the 15-tank collection. Run in Blender through its MCP connection.

The previous three models remain untouched. All dimensions are in game units;
Blender +Y is forward, exported glTF -Z. Existing stats are not changed.
"""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
# Reuse the tested material/mesh/export contracts, not the previous fleet build.
helpers = (ROOT/'design/armored-update/build_armored_fleet.py').read_text().split('\nmanifest=[]')[0]
exec(helpers.replace("SCENE='05_Armored_Fleet'", "SCENE='06_Complete_Fleet'"))
gold = mat('RoyalTrim', (.68,.43,.10), .78, .3)
energy = mat('EnergyGlow', (.025,.48,.65), .25, .3, .8)
core = mat('CoreGlow', (.7,.045,.018), .3, .35, .7)

# id, hull width/length, roof, turret width, family: each has its own silhouette.
specs = [
 ('guardian',2.35,3.45,1.90,1.55,'fortress'),
 ('sniper',1.96,3.55,1.43,1.05,'rail'),
 ('phantom',2.13,3.62,1.53,1.62,'stealth'),
 ('goldking',2.22,3.42,1.98,1.45,'royal'),
 ('twin',2.16,3.42,1.67,1.57,'double'),
 ('arty',2.12,3.70,1.75,1.32,'siege'),
 ('mamut',2.24,3.58,1.86,1.62,'ram'),
 ('bastion',2.34,3.58,1.98,1.63,'shield'),
 ('lynx',1.85,3.45,1.65,1.14,'lightdouble'),
 ('boxer',2.22,3.34,1.74,1.55,'rounded'),
 ('hover',2.32,3.60,1.57,1.32,'antigravity'),
 ('titan',2.36,3.66,2.01,1.64,'reactor'),
]

def rod(name,a,b,r,m):
    a,b=Vector(a),Vector(b)
    o=cyl(name,(a+b)/2,r,(b-a).length,m,n=10)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
    return o

def cannon(x,z,kind):
    start=.45; end=2.60
    if kind=='siege':
        # Slight elevation gives an artillery silhouette without a tall muzzle.
        a=(x,start,z-.10);b=(x,end,z+.24)
        rod('HowitzerTube',a,b,.145,metal)
        rod('RecoilSleeve',a,(x,1.45,z+.065),.225,paint)
        for sx in [-.24,.24]:rod('RecoilCylinder',(sx,.52,z-.20),(sx,1.40,z-.05),.075,edge)
        cyl('MuzzleCollar',(x,end,z+.24),.19,.15,edge,'Y')
        cyl('Bore',(x,end+.079,z+.24),.13,.009,rubber,'Y')
    elif kind=='rail':
        cube('RailCore',(x,1.58,z),(.15,2.15,.13),metal,.01)
        for sx in [-.13,.13]:
            cube('Rail',(sx,1.64,z+.015),(.065,2.1,.17),edge,.012)
            for y in [.95,1.25,1.55]:cube('RailCoil',(sx,y,z+.11),(.07,.10,.035),light,.004)
        cube('RailMuzzle',(x,2.61,z),(.35,.18,.24),paint,.015)
        cube('RailBore',(x,2.705,z),(.17,.012,.09),rubber,0)
    else:
        r=.075 if kind in ['double','lightdouble'] else .11
        cyl('Cannon',(x,(start+end)/2,z),r,end-start,metal,'Y')
        cyl('ThermalSleeve',(x,.94,z),r*1.55,.74,paint,'Y')
        cube('MuzzleBrake',(x,2.54,z),(r*2.8,.29,r*2.5),edge,.018)
        cube('Bore',(x,2.692,z),(r*1.65,.01,r*1.35),rubber,0)

manifest=[]
for idx,(kind,w,length,top,tw,family) in enumerate(specs):
    made=[]; hover=family=='antigravity'; deck=1.12
    for s in [-1,1]:
        x=s*w*.46
        if hover:
            tapered('LiftPod',.22,.78,(.57,length*.92),(.47,length*.76),0,paint).location.x=x
            cube('PodBumper',(x,0,.28),(.55,length*.91,.16),rubber,.055)
            for y in [-.95,0,.95]:
                cyl('LiftTurbine',(x,y,.235),.26,.12,metal,n=16)
                cyl('IonRing',(x,y,.17),.21,.04,energy,n=16)
                cyl('TurbineHub',(x,y,.14),.105,.035,metal,n=12)
            cube('PodLight',(x+s*.29,0,.45),(.025,length*.65,.05),energy,.006)
        else:
            cube('TrackCore',(x,0,.46),(.40,length,.69),rubber,.13)
            count=7 if family in ['siege','ram','reactor'] else 6
            for j in range(count):
                y=-length*.39+j*length*.78/(count-1)
                cyl('RoadWheel',(x+s*.205,y,.45),.26,.11,metal,'X')
                cyl('Hub',(x+s*.265,y,.45),.10,.025,edge,'X',10)
            for j in range(14):
                y=-length*.46+j*length*.92/13
                for z in [.12,.81]:cube('TrackShoe',(x,y,z),(.46,.13,.068),metal,0)
            for y in [-length*.49,length*.49]:cube('TrackEnd',(x,y,.46),(.46,.105,.53),rubber,.025)
        cube('Fender',(x,0,.91),(.53,length*.98,.11),paint,.025)
    tapered('Hull',.55,deck,(w*.82,length*.91),(w*.72,length*.70),0,paint)
    # Rear shelf remains clear for the game's body-mounted equipment.
    cube('RearDeck',(0,-1.13,deck-.065),(w*.65,.57,.13),paint,.025)
    for s in [-1,1]:
        cube('Grille',(s*.63,-.67,1.13),(.26,.58,.04),metal,.007)
        for j in range(4):cube('VentSlat',(s*.63,-.88+j*.14,1.162),(.25,.035,.025),edge,0)
        cube('LampGuard',(s*w*.30,length*.345,1.035),(.24,.13,.16),metal,.018)
        cube('Lamp',(s*w*.30,length*.366,1.04),(.16,.015,.055),light,.004)
        cyl('TowMount',(s*.58,length*.42,.68),.08,.08,edge,'Y',10)
        cube('ToolCase',(s*w*.34,-1.21,1.23),(.24,.46,.20),canvas,.025)
    if family in ['fortress','shield','reactor','ram']:
        for s in [-1,1]:
            for j in range(4):
                cube('SideArmor',(s*w*.49,-.96+j*.61,1.02),(.18,.50,.34),paint,.025)
                cube('ArmorFastener',(s*(w*.49+.095),-.96+j*.61,1.05),(.016,.07,.07),edge,0)
    if family=='ram':
        tapered('RamPlow',.34,.93,(w*.89,.33),(w*.74,.23),1.70,edge)
        for x in [-.66,-.33,0,.33,.66]:cube('PlowRib',(x,1.865,.64),(.075,.075,.52),metal,.012)
    if family=='shield':
        for s in [-1,1]:
            cube('ShieldEmitter',(s*.83,1.00,1.18),(.28,.49,.24),edge,.035)
            cube('EmitterSlit',(s*.83,1.25,1.20),(.15,.012,.09),energy,.008)
    if family=='reactor':
        for s in [-1,1]:
            cyl('RearReactor',(s*.54,-1.53,1.24),.19,.35,metal,'Y',16)
            cyl('ReactorCore',(s*.54,-1.715,1.24),.135,.025,core,'Y',16)
    turret_start=len(made)
    cyl('TurretRing',(0,-.11,1.16),tw*.46,.14,metal,n=20)
    if family=='rounded':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=10,location=(0,-.10,1.30))
        o=bpy.context.object;o.name='CastTurret';o.scale=(tw*.56,tw*.62,top-1.30);o.data.materials.append(paint);made.append(o)
        # Flat crown provides the same reliable cosmetic mounting surface.
        cyl('CrownPlate',(0,-.10,top),.48,.07,paint,n=20)
    else:
        upper=.55 if family=='stealth' else .76
        tapered('Turret',1.21,top,(tw,tw*1.12),(tw*upper,tw*.78),-.12,paint)
    if family=='stealth':
        for s in [-1,1]:
            tapered('StealthCheek',1.28,top-.06,(.42,.86),(.12,.62),.05,edge).location.x=s*.64
            cube('OpticSlit',(s*.48,.46,1.41),(.30,.018,.045),light,.004)
    elif family=='royal':
        for s in [-1,1]:
            cube('RoyalCheek',(s*.66,.05,1.65),(.12,.83,.25),gold,.025)
            for j in range(3):cube('RoyalCrest',(s*.728,-.18+j*.20,1.70),(.012,.075,.16),decal,.005)
    elif family=='fortress':
        for s in [-1,1]:cube('DefenderCheek',(s*.67,.12,1.53),(.25,.87,.43),edge,.045)
    elif family=='reactor':
        for s in [-1,1]:
            cube('ReactorCheek',(s*.70,.10,1.70),(.27,.90,.38),edge,.035)
            for j in range(3):cube('CoolingPort',(s*.844,-.14+j*.20,1.73),(.015,.09,.14),core,.004)
    else:
        for s in [-1,1]:cube('Cheek',(s*tw*.46,.02,(1.21+top)/2),(.12,tw*.65,.23),edge,.025)
    gunz=max(1.32,(1.21+top)/2)
    offsets=[-.28,.28] if family in ['double','lightdouble'] else [0]
    for x in offsets:
        cube('Mantlet',(x,.54,gunz),(.30,.30,.28),metal,.035)
        cannon(x,gunz,family)
    cyl('Hatch',(0,-.27,top+.025),.27,.05,metal,n=16)
    cyl('HatchLid',(0,-.27,top+.068),.235,.035,paint,n=16)
    cube('Periscope',(.31,-.18,top+.045),(.17,.19,.10),metal,.012)
    cube('PeriscopeGlass',(.31,-.079,top+.055),(.12,.012,.04),light,0)
    for s in [-1,1]:
        for j in range(3):cyl('SmokeTube',(s*(tw*.46+.025),-.36+j*.15,top-.13),.042,.20,metal,'Y',8)
    if family=='rail':
        cube('RangeFinder',(0,.05,top+.12),(.40,.28,.15),metal,.02)
        for x in [-.13,.13]:cyl('RangeLens',(x,.199,top+.12),.05,.02,light,'Y',10)
    if family=='siege':
        for s in [-1,1]:cube('AmmoLocker',(s*.46,-.65,1.57),(.30,.28,.47),paint,.025)
    if family=='shield':
        cube('ShieldSpine',(0,-.95,1.70),(.30,.25,.58),edge,.035)
        cube('ShieldCore',(0,-1.086,1.75),(.17,.014,.32),energy,.008)
    if family=='lightdouble':
        for s in [-1,1]:cube('SensorEar',(s*.43,-.29,top+.17),(.13,.21,.30),edge,.02)
    cyl('AntennaBase',(-tw*.28,-.47,top+.04),.052,.10,metal)
    cyl('Antenna',(-tw*.28,-.47,top+.30),.012,.46,metal,n=6)
    for o in made[turret_start:]:o['turret']=True
    accent=gold if family=='royal' else decal
    for j in range(2):cube('UnitStripe',(-.09+j*.17,1.00,deck+.009),(.052,.23,.017),accent,0)
    root,entry=group_export('tank_'+kind+'_mk2',made)
    root.location=((idx%4-1.5)*5.7,(idx//4)*6.2,0)
    root['tank_id']=kind;root['design_family']=family
    entry.update(tank=kind,family=family,turretTop=round(top+.09,2),rearDeckTop=deck)
    manifest.append(entry)

scene['notes']='Original completed fleet: 12 distinct models. Existing three Mk2 models are retained separately. Exported at origin before gallery layout.'
bpy.data.libraries.write(str(ROOT/'design/complete-fleet/Complete-Fleet.blend'),{scene},path_remap='RELATIVE',fake_user=True)
(ROOT/'design/complete-fleet/manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest))
