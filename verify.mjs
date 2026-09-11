import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as Three from './dist/vendor/three.module.js';
const source=fs.readFileSync('dist/app.js','utf8');
for(const boardId of ['nano','beagleplay']){
 const {parts,nets}=await import(`./dist/${boardId}.js`);
 assert.equal(new Set(parts.map(p=>p.id)).size,parts.length,'Unique component IDs');
 assert.equal(new Set(nets.map(n=>n.id)).size,nets.length,'Unique net IDs');
 for(const n of nets){assert(n.ids.length>=2);for(const id of n.ids)assert(parts.some(p=>p.id===id),`Missing endpoint ${id}`);}
 for(const p of parts)assert(nets.some(n=>n.ids.includes(p.id)),`Unconnected part ${p.id}`);
 const elements=new Map();
 function el(key){if(!elements.has(key))elements.set(key,{value:'',checked:true,style:{},dataset:{},classList:{toggle(){}},addEventListener(){},append(){},remove(){},getBoundingClientRect(){return{width:760,height:800,left:0,top:0};}});return elements.get(key);}
 const document={querySelector:el,querySelectorAll:()=>[],getElementById:id=>el('#'+id),createElement:()=>({getContext:()=>({fillText(){},beginPath(){},roundRect(){},fill(){},stroke(){}})})};
 class Renderer{constructor(){this.domElement=el('canvas');this.shadowMap={};}setPixelRatio(){}setClearColor(){}setSize(){}setAnimationLoop(fn){this.frame=fn;}render(){}}
 class Controls{constructor(camera){this.camera=camera;this.target=new Three.Vector3();}addEventListener(){}update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld();}}
 let body=source.replace(/^import .*;$/gm,'').replace("const {parts,nets}=await import(boardId==='beagleplay'?'./beagleplay.js':'./nano.js');",'');
 body+='\nreturn {select,setView,setExplosion,drawWires,scene,camera,renderer,wires,highlight,board,selector, get selectedNet(){return selectedNet;}};';
 const run=new (Object.getPrototypeOf(async function(){}).constructor)('THREE','OrbitControls','document','location','devicePixelRatio','ResizeObserver','parts','nets',body);
 const location={search:'?board='+boardId};
 const app=await run({...Three,WebGLRenderer:Renderer},Controls,document,location,1,class{constructor(fn){this.fn=fn;}observe(){this.fn();}},parts,nets);
 for(const p of parts){app.select(p.id);app.scene.updateMatrixWorld(true);assert(app.wires.children.length>0,`No paths for ${p.id}`);const b=new Three.Box3().setFromObject(p.object);assert(Number.isFinite(b.min.x)&&!b.isEmpty(),`Invalid model ${p.id}`);}
 for(const amount of [0,.5,1]){app.setExplosion(amount);app.scene.updateMatrixWorld(true);for(const wire of app.wires.children)assert([...wire.geometry.attributes.position.array].every(Number.isFinite));}
 app.setExplosion(0);
 for(const view of ['top','bottom','perspective']){app.setView(view);assert(Number.isFinite(app.camera.position.length()));}
 el('#connections').onchange({target:{checked:false}});assert.equal(app.wires.children.length,0);
 el('#connections').onchange({target:{checked:true}});assert(app.wires.children.length>0);
 app.selector.value=boardId==='nano'?'beagleplay':'nano';app.selector.onchange();assert.equal(location.href,'/?board='+app.selector.value);
 // Verify the two physical board faces and representative raycast selection.
 for(const id of boardId==='beagleplay'?['mcu','rj45']:['imu','mcu']){
   const p=parts.find(p=>p.id===id);app.setView(p.side==='bottom'?'bottom':'top');app.scene.updateMatrixWorld(true);
   const center=new Three.Box3().setFromObject(p.body).getCenter(new Three.Vector3());
   const ray=new Three.Raycaster(app.camera.position,center.clone().sub(app.camera.position).normalize());
   ray.camera=app.camera;const hits=ray.intersectObject(app.board,true).filter(h=>h.object.userData.id);
   assert(hits.some(h=>h.object.userData.id===id),`Cannot raycast ${id}`);
 }
 console.log(`${boardId}: ${parts.length} parts, ${nets.length} nets; geometry, endpoints, selection, explosion, controls and switching passed`);
}
