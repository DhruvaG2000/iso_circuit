from pathlib import Path
p=Path('dist/app.js')
s=p.read_text(encoding='utf-8')
s=s.replace("const colors=", """if(isBeagle){
document.title='Nano Atlas — BeaglePlay';
document.querySelector('h1').innerHTML='Beagle<em>Play.</em>';
document.querySelector('.revision').textContent='BeagleBoard.org · AM6254';
document.querySelector('.specs').innerHTML='<span><b>1.4</b> GHz</span><span><b>2</b> GB RAM</span><span><b>80 × 80</b> mm</span>';
document.querySelector('.source-link').href='https://www.beagleboard.org/boards/beagleplay';
document.querySelector('.accuracy').innerHTML='<b>About this model</b><p>Educational reconstruction of BeaglePlay. Shapes and placement are approximate. Paths show logical connections; multi-wire buses and support circuits are grouped. Front holds the connectors; back holds the main chips. No live hardware readings.</p><a href="https://docs.beagleboard.org/boards/beagleplay/03-design.html" target="_blank" rel="noreferrer">Official design & schematics ↗</a><a href="https://docs.beagleboard.org/boards/beagleplay/04-expansion.html" target="_blank" rel="noreferrer">Expansion pinouts ↗</a><small>Based on BeagleBoard.org documentation (CC BY-SA 4.0) and upstream Linux board definitions. Grouped rail paths do not imply a shared voltage.</small>';
document.querySelector('.legend').innerHTML='<span style="--c:#54e3c2">Data / control</span><span style="--c:#bb9bff">Media / RF</span><span style="--c:#ffb75a">Power</span><span style="--c:#94a4b8">Ground</span>';
document.querySelector('#top').textContent='Front';document.querySelector('#bottom').textContent='Back';
}
const underside=p=>p.side==='bottom'||p.group==='UNDERSIDE';
const colors=""")
s=s.replace("scene.add(rim);", "scene.add(rim);const backLight=new THREE.DirectionalLight(0xe5f1ff,3);backLight.position.set(-20,-40,30);scene.add(backLight);")
s=s.replace('mat(0x087b72,.25,.4)', 'mat(isBeagle?0x202930:0x087b72,.25,.4)')
a=s.index('const outline=');b=s.index('for(const p of parts.filter',a)
s=s[:a]+"""const outline=new THREE.Shape();const halfW=isBeagle?20:22.5,halfD=isBeagle?20:9;
outline.moveTo(-halfW+1,-halfD);outline.lineTo(halfW-1,-halfD);outline.quadraticCurveTo(halfW,-halfD,halfW,-halfD+1);outline.lineTo(halfW,halfD-1);outline.quadraticCurveTo(halfW,halfD,halfW-1,halfD);outline.lineTo(-halfW+1,halfD);outline.quadraticCurveTo(-halfW,halfD,-halfW,halfD-1);outline.lineTo(-halfW,-halfD+1);outline.quadraticCurveTo(-halfW,-halfD,-halfW+1,-halfD);
if(isBeagle)for(const x of [-13,15])for(const z of [-18,18]){const hole=new THREE.Path();hole.absarc(x,z,.9,0,Math.PI*2,true);outline.holes.push(hole);}
"""+s[b:]
s=s.replace("surfaceText(board,'NANO 33 BLE SENSE',-3,.53,0,16);surfaceText(board,'ARDUINO',12,-.54,0,13).rotation.x=Math.PI/2;", """if(isBeagle){
surfaceText(board,'BeaglePlay',5,.53,-7,16);surfaceText(board,'mikroBUS',7,.53,8,10);surfaceText(board,'BEAGLEBOARD.ORG',8,-.54,-1,15).rotation.x=Math.PI/2;
for(const x of [-13,15])for(const z of [-18,18]){const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1.4,24),gold);ring.rotation.x=-Math.PI/2;ring.position.set(x,.52,-z);board.add(ring);}
}else{surfaceText(board,'NANO 33 BLE SENSE',-3,.53,0,16);surfaceText(board,'ARDUINO',12,-.54,0,13).rotation.x=Math.PI/2;}
""")
s=s.replace("p.group==='UNDERSIDE'?-.65:.55", "underside(p)?-.65:.55")
s=s.replace('g.userData.id=p.id;', "if(p.side==='bottom')g.rotation.x=Math.PI;g.userData.id=p.id;")
s=s.replace("if(p.kind==='pin'){", """if(isBeagle&&['socket','contact','connector','fpc','battery','coax','header','ledbank'].includes(p.kind)){
if(p.kind==='socket'){body=box(g,-p.w/2+.6,p.h/2,0,1.2,p.h,p.d,black);box(g,p.w/2-.6,p.h/2,0,1.2,p.h,p.d,black);box(g,0,.2,p.d/2,p.w,.4,.6,black);}
if(p.kind==='contact'){body=box(g,0,p.h/2,0,p.w,p.h,p.d,gold);box(g,0,p.h+.03,0,p.w*.62,.08,p.d*.62,black);}
if(p.kind==='connector'||p.kind==='fpc'){body=box(g,0,p.h/2,0,p.w,p.h,p.d,mat(0xc8c9c0));box(g,0,p.h+.05,0,p.w*.5,.1,p.d*.88,black);for(let i=0;i<(p.kind==='fpc'?18:4);i++)box(g,-p.w/2,.2,(i/((p.kind==='fpc'?18:4)-1)-.5)*p.d*.85,.7,.15,.16,gold);}
if(p.kind==='battery'){body=new THREE.Mesh(new THREE.CylinderGeometry(p.w/2,p.w/2,p.h,36),black);body.position.y=p.h/2;g.add(body);const inner=new THREE.Mesh(new THREE.CylinderGeometry(p.w*.39,p.w*.39,.2,36),silver);inner.position.y=p.h+.05;g.add(inner);box(g,0,p.h+.2,0,1,.25,p.d*.92,gold);}
if(p.kind==='coax'){body=box(g,0,.15,0,p.w,.3,p.d,mat(0xd6d0ba));const ring=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.4,18,1,true),gold);ring.position.y=.5;g.add(ring);}
if(p.kind==='header'){body=box(g,0,.3,0,p.w,.6,p.d,black);for(let i=0;i<3;i++)box(g,(i-1)*1.2,.8,0,.35,1.2,.35,gold);}
if(p.kind==='ledbank'){body=box(g,0,.1,0,p.w,.2,p.d,black);for(let i=0;i<5;i++)box(g,(i-2)*.65,.35,0,.4,.25,.55,mat(0xb5de65));}
}else if(p.kind==='pin'){""")
s=s.replace("p.kind==='usb'?silver", "['usb','rj45','rj11','hdmi','sd','shield'].includes(p.kind)?silver")
s=s.replace("if(p.kind==='module'){", """if(isBeagle&&['rj45','rj11','hdmi'].includes(p.kind)){box(g,-p.w/2-.02,p.h/2,0,.08,p.h*.72,p.d*.78,black);for(let i=0;i<(p.kind==='rj45'?8:4);i++)box(g,-p.w/2-.08,p.h*.25,(i/((p.kind==='rj45'?8:4)-1)-.5)*p.d*.6,.15,.2,.18,gold);}
if(isBeagle&&p.kind==='shield'){surfaceText(g,p.model.split(' · ').at(-1),0,p.h+.02,0,p.w*.9,'#34424a',65);}
if(isBeagle&&p.kind==='sd'){box(g,0,p.h+.03,0,p.w*.6,.08,p.d*.8,mat(0x858f97));box(g,0,.6,p.d/2+.03,p.w*.85,.5,.06,black);}
if(p.kind==='module'){""")
s=s.replace("if(!['pin','passives','pads','jumper'].includes(p.kind))", "if(!['pin','contact','passives','pads','jumper'].includes(p.kind))")
s=s.replace("const y=origin.object.position.y+(origin.group==='UNDERSIDE'?-.4:origin.h+.3);const ty=target.object.position.y+(target.group==='UNDERSIDE'?-.4:target.h+.3);", "const y=origin.object.position.y+(underside(origin)?-1:1)*(origin.h+.3);const ty=target.object.position.y+(underside(target)?-1:1)*(target.h+.3);")
s=s.replace('mid.y=Math.max(y,ty)+lift;', 'mid.y=underside(origin)?Math.min(y,ty)-lift:Math.max(y,ty)+lift;')
s=s.replace('p.object.position.y+p.h/2', 'p.object.position.y+(underside(p)?-1:1)*p.h/2')
s=s.replace("${p.kind==='pin'?'':p.model.split(' · ')[0]}", "${p.kind==='pin'||isBeagle?'':p.model.split(' · ')[0]}")
s=s.replace("if(parts.find(p=>p.id===id).group==='UNDERSIDE')setView('bottom');", "if(underside(parts.find(p=>p.id===id))&&camera.position.y>0)setView('bottom');else if(isBeagle&&!underside(parts.find(p=>p.id===id))&&camera.position.y<0)setView('top');")
s=s.replace("view.toUpperCase()+' VIEW'", "(isBeagle?(view==='top'?'FRONT':'BACK'):view.toUpperCase())+' VIEW'")
s=s.replace("p.kind==='pin'?0:p.group==='UNDERSIDE'?-8:6+(parts.indexOf(p)%4)*2", "p.kind==='pin'?0:underside(p)?-8:p.id.startsWith('mk-')||p.id==='mikro'?8:6+(parts.indexOf(p)%4)*2")
s=s.replace("select('imu');", "select(isBeagle?'rj45':'imu');")
s=s.replace("controls.update();renderer.render(scene,camera);", "controls.update();grid.visible=camera.position.y>0;for(const p of parts)if(p.label)p.label.visible=showLabels&&(p.id===selected||p.id==='mcu')&&(underside(p)?camera.position.y<0:camera.position.y>=0);renderer.render(scene,camera);")
p.write_text(s,encoding='utf-8')
PYCSS='''\n.board-picker{display:flex;align-items:center;gap:12px;min-width:0}.board-picker>span{font-size:12px;letter-spacing:1.5px;color:#90a3b2}.board-picker select{font:inherit;font-size:14px;color:#dcf6ef;background:#1c302f;border:1px solid #3d685e;border-radius:6px;padding:11px 30px 11px 12px;max-width:100%;cursor:pointer}header{gap:28px}.part{overflow-wrap:anywhere}@media(max-width:850px){header{height:auto;min-height:76px;padding:14px 18px;flex-wrap:wrap;gap:12px}.board-picker{order:3;width:100%}.board-picker select{flex:1}.brand{margin-right:auto}.source-link{margin-left:0}.board-picker>span{display:none}}@media(max-width:550px){.board-picker select{width:100%;font-size:14px}.source-link{max-width:none}.workbench{height:620px}}
'''
p=Path('dist/style.css');p.write_text(p.read_text(encoding='utf-8')+PYCSS,encoding='utf-8')
