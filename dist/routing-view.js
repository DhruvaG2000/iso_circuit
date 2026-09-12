import * as THREE from 'three';

export function createRouting({scene,parts,camera,escape,onChange}){
 const group=new THREE.Group();scene.add(group);
 let data=null,selected=null,active=null,layer='all',enabled=true,pins=[];
 const palette=[0x00a782,0xe8a52c,0x568dff,0xd774ed,0xf47763,0x5dc4d2,0xb1bb4d,0xbb85ff];
 const layerName=l=>l===1?'L1 · Top':l===32?'L8 · Bottom':`L${l} · Inner`;
 const netName=p=>p.net===null?'No net':data.nets[p.net].name;
 const signal=p=>selected==='J6'?({'1':'GND','2':'RX','3':'TX'}[p.number]||netName(p)):netName(p);
 function clear(){for(const c of [...group.children]){c.dispose?.();c.geometry?.dispose();c.material?.map?.dispose();c.material?.dispose();group.remove(c);}pins=[];}
 function dot(x,y,z,r,color,pin){const m=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),new THREE.MeshBasicMaterial({color,depthTest:false}));m.position.set(x,y,z);m.renderOrder=22;if(pin){m.userData.pin=pin;pins.push(m);}group.add(m);}
 function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#10242bef';ctx.fillRect(0,0,512,64);ctx.fillStyle='#e9fff7';ctx.font='27px Arial';ctx.fillText(text,12,43);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));s.position.set(x,y,z);s.scale.set(6,.75,1);s.renderOrder=24;group.add(s);}
 function draw(){clear();if(!data||!selected)return;
  const part=parts.get(selected),side=part?.userData.side==='bottom'?-1:1;
  // Pin markers follow the selected package when exploded; copper stays on the PCB.
  const bounds=part?new THREE.Box3().setFromObject(part):null;
  const y=bounds?(side>0?bounds.max.y+.13:bounds.min.y-.13):side*.43;
  const cp=data.components[selected]||[];
  if(/^J/.test(selected))for(const p of cp){dot(p.x,y,p.z,selected==='J6'?.22:.13,p.net===active?0xffcf5c:0x21bf99,p);if(cp.length<=4)label(`${p.number} · ${signal(p)}`,p.x+3.8,y,p.z);}
  if(!enabled||active===null)return;const n=data.nets[active];
  // Exact exported centerlines, laid on their copper layer; depth bypass is an explicit X-ray overlay.
  const yFor=l=>.386334-(l===32?7:l-1)*.110381;
  for(const l of data.layers){if(layer!=='all'&&Number(layer)!==l)continue;const vertices=[];
   for(const [tl,x1,z1,x2,z2,w] of n.tracks){if(tl!==l)continue;const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz);if(!len)continue;const h=Math.max(w,.045)/2,ox=-dz/len*h,oz=dx/len*h,y=yFor(l);vertices.push(x1+ox,y,z1+oz,x1-ox,y,z1-oz,x2+ox,y,z2+oz,x2+ox,y,z2+oz,x1-ox,y,z1-oz,x2-ox,y,z2-oz);}
   if(vertices.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:palette[data.layers.indexOf(l)],side:THREE.DoubleSide,depthTest:false}));m.renderOrder=20;group.add(m);}
  }
  const pads=n.pads.filter(p=>layer==='all'||p.layer===74||p.layer===Number(layer));
  const dots=new THREE.InstancedMesh(new THREE.SphereGeometry(.10,8,6),new THREE.MeshBasicMaterial({color:0xffd574,depthTest:false}),pads.length),matrix=new THREE.Matrix4();
  pads.forEach((p,i)=>dots.setMatrixAt(i,matrix.makeTranslation(p.x,p.layer===32?-.41:.41,p.z)));dots.renderOrder=21;group.add(dots);
  const vias=n.vias.filter(v=>layer==='all'||(Number(layer)>=v[3]&&Number(layer)<=v[4]));
  const rings=new THREE.InstancedMesh(new THREE.RingGeometry(.5,1,12).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,depthTest:false}),vias.length);
  vias.forEach(([x,z,d],i)=>{const r=Math.max(.07,d*.5);matrix.makeScale(r,1,r);matrix.setPosition(x,.42,z);rings.setMatrixAt(i,matrix);});rings.renderOrder=21;group.add(rings);
 }
 function choose(p){active=p.net;draw();renderPanel();onChange?.();}
 function renderPanel(){const host=document.querySelector('#pin-panel');if(!host)return;if(!data){host.innerHTML='<p class="muted">Loading PCB pin map…</p>';return;}const cp=data.components[selected]||[],n=active===null?null:data.nets[active];
  host.innerHTML=`<div class="connections-title">PINS & PCB ROUTING <span>${cp.length}</span></div><p class="muted">Select a pin to follow its copper traces. Pin names are board-side signals.</p>${selected==='J6'?'<p class="serial-note"><b>J6 serial console</b> · 1 GND · 2 RX · 3 TX<br>Adapter TX → board RX; adapter RX → board TX.</p>':''}<label class="pin-filter">Find pin or signal<input id="pin-search" type="search" placeholder="Pin number, RX, GND…"></label><div class="pin-list">${cp.map((p,i)=>`<button class="pin-button ${active!==null&&p.net===active?'active':''}" data-pin="${i}"><b>${escape(p.number||'Pad')}</b><span>${escape(signal(p))}</span></button>`).join('')||'<p class="muted">No matching pads in this PCB export.</p>'}</div><label class="pin-filter">Copper layer<select id="copper-layer"><option value="all">All layers · X-ray</option>${data.layers.map(l=>`<option value="${l}" ${String(l)===layer?'selected':''}>${layerName(l)}</option>`).join('')}</select></label>${n?`<div class="trace-info"><b>${escape(n.name)}</b><p>${n.tracks.filter(t=>layer==='all'||t[0]===Number(layer)).length} trace segments · ${n.vias.length} vias · ${n.pads.length} pads</p><div class="layer-legend">${data.layers.filter(l=>n.tracks.some(t=>t[0]===l)&&(layer==='all'||Number(layer)===l)).map(l=>`<span><i style="background:#${palette[data.layers.indexOf(l)].toString(16).padStart(6,'0')}"></i>${layerName(l)}</span>`).join('')}</div><button id="clear-trace">Clear trace</button></div>`:'<p class="muted">No signal selected.</p>'}<p class="muted">X-ray highlights follow the exported PCB coordinates, visible through packages. Copper pours and plane fills are not shown; GND and power connections may continue through those planes. Small differences from the CAD revision are possible.</p>`;
  host.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>choose(cp[Number(b.dataset.pin)]));host.querySelector('#pin-search').oninput=e=>{const q=e.target.value.toLowerCase();host.querySelectorAll('[data-pin]').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q));};host.querySelector('#copper-layer').onchange=e=>{layer=e.target.value;draw();renderPanel();};const c=host.querySelector('#clear-trace');if(c)c.onclick=()=>{active=null;draw();renderPanel();};
 }
 fetch(new URL('./assets/routing.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('PCB map unavailable');return r.json();}).then(d=>{data=d;document.querySelector('#viewport').dataset.routingReady='true';draw();renderPanel();}).catch(()=>{const h=document.querySelector('#pin-panel');if(h)h.textContent='PCB pin map could not load. Reload to retry.';});
 return {select(ref){selected=ref;active=null;draw();},draw,renderPanel,setEnabled(value){enabled=value;draw();},hit(ray){return ray.intersectObjects(pins,false)[0]?.object.userData.pin;},choose,describe:p=>`${p.ref} pin ${p.number} · ${netName(p)}`};
}
