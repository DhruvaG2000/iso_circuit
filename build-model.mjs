import fs from 'node:fs';
import * as T from './dist/vendor/three.module.js';
import {Resvg} from '@resvg/resvg-js';
const instances=JSON.parse(fs.readFileSync('assets-source/cad-instances.json'));
const cache=new Map();
const minX=-1300300*.000254,maxY=1237170*.000254,size=314970*.000254,cx=minX+size/2,cy=maxY-size/2,midZ=-1.545336/2;
const world=new T.Matrix4().set(.5,0,0,-cx*.5,0,0,.5,-midZ*.5,0,-.5,0,cy*.5,0,0,0,1);
const json={asset:{version:'2.0',generator:'BeaglePlay CAD asset pipeline',copyright:'2023 Seeed Technology Co., Ltd and BeagleBoard.org Foundation. CC BY 4.0. Adapted geometry and materials.'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[],images:[{uri:'pcb-top.png'},{uri:'pcb-bottom.png'}],textures:[{source:0,sampler:0},{source:1,sampler:0}],samplers:[{magFilter:9729,minFilter:9987,wrapS:33071,wrapT:33071}]};
let chunks=[],offset=0,totalTriangles=0;const materialCache=new Map();
function accessor(values,type,componentType=5126){const C=componentType===5125?Uint32Array:Float32Array,ar=new C(values);const data=Buffer.from(ar.buffer);const view=json.bufferViews.push({buffer:0,byteOffset:offset,byteLength:data.length})-1;chunks.push(data);offset+=data.length;const n=type==='VEC3'?3:type==='VEC2'?2:1;const a={bufferView:view,componentType,count:values.length/n,type};if(type==='VEC3'){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<values.length;i++){a.min[i%3]=Math.min(a.min[i%3],values[i]);a.max[i%3]=Math.max(a.max[i%3],values[i]);}}return json.accessors.push(a)-1;}
function material(color,ref,explicit=true){let c=color?.slice()||[.4,.42,.44],metal=0,rough=.53;
 const max=Math.max(...c),min=Math.min(...c),blue=c[2]>c[0]*1.15;
 if(!explicit){if(/^J(?:1|2|4|10|13|14|24)$/.test(ref)||/^SH/.test(ref)){c=[.49,.53,.56];metal=.88;rough=.3;}else if(/^J(?:7|8|17|18)$/.test(ref)){c=[.8,.8,.74];rough=.4;}else if(/^U|^J21/.test(ref))c=[.018,.023,.027];else c=[.075,.065,.05];}
 else if(ref==='J10'&&max<.6&&max>.2){c=[.5,.53,.55];metal=.9;rough=.3;}
 else if(/^J(?:7|8|17|18)$/.test(ref)&&max>.25){c=[.78,.79,.74];metal=0;rough=.45;}
 else if(blue&&max>.35){c=[.45,.5,.55];metal=.9;rough=.3;}
 else if(max-min<.035&&max>.25&&max<.85){c=[.48,.51,.53];metal=.85;rough=.32;}
 else if(c[0]>.4&&c[1]>.25&&c[2]<c[0]*.55){c=[.65,.45,.16];metal=.83;rough=.28;}
 else if(max<.15){c=c.map(v=>Math.max(.01,v*.45));rough=.64;}
 const key=JSON.stringify([c,metal,rough]);if(materialCache.has(key))return materialCache.get(key);
 const id=json.materials.push({name:metal>.5?'Plated metal':'Molded package',pbrMetallicRoughness:{baseColorFactor:[...c,1],metallicFactor:metal,roughnessFactor:rough},doubleSided:true})-1;materialCache.set(key,id);return id;
}
function primitive(g,mat,translation=[0,0,0]){const p=g.p.map((v,i)=>v-translation[i%3]);totalTriangles+=g.i.length/3;return {attributes:{POSITION:accessor(p,'VEC3'),NORMAL:accessor(g.n,'VEC3'),...(g.uv?{TEXCOORD_0:accessor(g.uv,'VEC2')}:{})},indices:accessor(g.i,'SCALAR',5125),material:mat};}
const perPart=new Map();
for(const instance of instances){if(!cache.has(instance.rep))cache.set(instance.rep,JSON.parse(fs.readFileSync(`assets-source/meshes-color/${instance.rep}.json`)));
 const matrix=world.clone().multiply(new T.Matrix4().fromArray(instance.matrix)),normal=new T.Matrix3().getNormalMatrix(matrix),groups=perPart.get(instance.ref)||new Map();perPart.set(instance.ref,groups);
 for(const mesh of cache.get(instance.rep)){
  const a=mesh.attributes.position.array,n=mesh.attributes.normal.array,indices=mesh.index.array;
  const faceMaterials=new Uint16Array(indices.length/3);faceMaterials.fill(material(mesh.color,instance.ref,!!mesh.color));
  for(const f of mesh.brep_faces)if(f.color){const mat=material(f.color,instance.ref);faceMaterials.fill(mat,f.first,f.last+1);}
  const byMaterial=new Map();for(let ti=0;ti<faceMaterials.length;ti++){const mat=faceMaterials[ti];if(!byMaterial.has(mat))byMaterial.set(mat,[]);byMaterial.get(mat).push(ti);}
  for(const [mat,tris]of byMaterial){const g=groups.get(mat)||{p:[],n:[],i:[]};groups.set(mat,g);const remap=new Map();for(const ti of tris)for(let k=0;k<3;k++){const vi=indices[ti*3+k];if(!remap.has(vi)){const p=new T.Vector3().fromArray(a,vi*3).applyMatrix4(matrix),nn=new T.Vector3().fromArray(n,vi*3).applyMatrix3(normal).normalize();remap.set(vi,g.p.length/3);g.p.push(...p.toArray());g.n.push(...nn.toArray());}g.i.push(remap.get(vi));}}
 }
}
const metadata={source:'Official BeaglePlay December 2022 CAD assembly',units:'2 mm per viewer unit',parts:[],triangles:0};
function addGeometry(ref,geo,mat){const groups=perPart.get(ref)||new Map();perPart.set(ref,groups);const g=groups.get(mat)||{p:[],n:[],i:[]};groups.set(mat,g);const base=g.p.length/3;g.p.push(...geo.attributes.position.array);g.n.push(...geo.attributes.normal.array);if(geo.index)for(const i of geo.index.array)g.i.push(i+base);else for(let i=0;i<geo.attributes.position.count;i++)g.i.push(base+i);}
// The source CAD omits the Wi-Fi module body. Reconstruct its documented
// 13.4 × 13.3 mm package at the official placement coordinate.
const wifiX=(-10496.64*.0254-cx)*.5,wifiZ=-(12070*.0254-cy)*.5;
addGeometry('U5',new T.BoxGeometry(6.7,.8,6.65).translate(wifiX,-.786334,wifiZ),material([.04,.05,.045],'U5'));
addGeometry('U5',new T.BoxGeometry(6.3,.35,6.25).translate(wifiX,-1.23,wifiZ),material([.65,.65,.65],'U5'));
// Dark connector inserts and contacts are material detailing, not electrical nets.
for(const [ref,width,height]of [['J24',6.9,4.65],['J2',5.65,4.65]]){
 const groups=perPart.get(ref),bounds=new T.Box3();for(const g of groups.values())for(let i=0;i<g.p.length;i+=3)bounds.expandByPoint(new T.Vector3().fromArray(g.p,i));const x=(bounds.min.x+bounds.max.x)/2,z=bounds.max.z-.28,y=3.6;
 addGeometry(ref,new T.BoxGeometry(width,height,.15).translate(x,y,z),material([.013,.014,.014],ref));
 for(let i=0;i<(ref==='J24'?8:4);i++)addGeometry(ref,new T.BoxGeometry(.13,1.55,.07).translate(x+(i-(ref==='J24'?7:3)/2)*.49,y-.4,z+.11),material([.8,.55,.2],ref));
}
for(const [ref,groups]of perPart){const bounds=new T.Box3();for(const g of groups.values())for(let i=0;i<g.p.length;i+=3)bounds.expandByPoint(new T.Vector3().fromArray(g.p,i));const center=bounds.getCenter(new T.Vector3()).toArray(),dimensions=bounds.getSize(new T.Vector3()).multiplyScalar(2).toArray();const side=center[1]<0?'bottom':'top';
 const primitives=[...groups].map(([mat,g])=>primitive(g,mat,center));
 const marking={U1:['TEXAS INSTRUMENTS','AM6254'],U2:['SAMSUNG','DDR4'],U3:['KINGSTON','eMMC'],U5:['TEXAS INSTRUMENTS','WL1807MOD'],U9:['TEXAS INSTRUMENTS','CC1352P7']}[ref];
 if(marking){const w=dimensions[0]*.34,d=dimensions[2]*.34,texId=json.textures.length;const file=`mark-${ref}.png`;fs.writeFileSync('dist/assets/'+file,new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><text x="50" y="210" fill="#b7b9b1" font-family="Arial" font-size="28">${marking[0]}</text><text x="50" y="265" fill="#b7b9b1" font-family="Arial" font-size="40">${marking[1]}</text><circle cx="55" cy="350" r="6" fill="#959b94"/></svg>`).render().asPng());json.images.push({uri:file});json.textures.push({source:json.images.length-1,sampler:0});const mat=json.materials.push({name:ref+' laser marking',alphaMode:'BLEND',doubleSided:true,pbrMetallicRoughness:{baseColorTexture:{index:texId},baseColorFactor:[1,1,1,1],metallicFactor:0,roughnessFactor:.9}})-1;
 const y=bounds.min.y-.006;primitives.push(primitive({p:[center[0]-w/2,y,center[2]-d/2,center[0]+w/2,y,center[2]-d/2,center[0]+w/2,y,center[2]+d/2,center[0]-w/2,y,center[2]+d/2],n:[0,-1,0,0,-1,0,0,-1,0,0,-1,0],uv:[0,0,1,0,1,1,0,1],i:[0,1,2,0,2,3]},mat,center));}
 const meshId=json.meshes.push({name:ref,primitives})-1;const id=json.nodes.push({name:ref,mesh:meshId,translation:center,extras:{ref,side,approximate:ref==='U5'}})-1;json.scenes[0].nodes.push(id);metadata.parts.push({ref,side,center,dimensions,approximate:ref==='U5'});
}
// A rounded PCB with mounting holes and manufacturing artwork on both faces.
const shape=new T.Shape(),h=size/2,r=1.3;shape.moveTo(-h+r,-h);shape.lineTo(h-r,-h);shape.quadraticCurveTo(h,-h,h,-h+r);shape.lineTo(h,h-r);shape.quadraticCurveTo(h,h,h-r,h);shape.lineTo(-h+r,h);shape.quadraticCurveTo(-h,h,-h,h-r);shape.lineTo(-h,-h+r);shape.quadraticCurveTo(-h,-h,-h+r,-h);
// Mounting-pad centers from the official solder-mask artwork (D10 flashes).
for(const rawX of [-1289000,-996530])for(const rawY of [979300,1201170]){const hole=new T.Path();hole.absarc(rawX*.000254-cx,rawY*.000254-cy,1.6,0,Math.PI*2,true);shape.holes.push(hole);}
const geo=new T.ExtrudeGeometry(shape,{depth:1.545336,bevelEnabled:false,curveSegments:24}),p=geo.attributes.position,n=geo.attributes.normal;
const boardGroups=[{p:[],n:[],i:[],uv:[]},{p:[],n:[],i:[],uv:[]},{p:[],n:[],i:[],uv:[]}];
for(let i=0;i<p.count;i+=3){const layer=n.getZ(i)>.9?0:n.getZ(i)<-.9?1:2,g=boardGroups[layer];for(let k=0;k<3;k++){const j=i+k,x=p.getX(j),y=p.getY(j),z=p.getZ(j);g.i.push(g.p.length/3);g.p.push(x*.5,(z-1.545336/2)*.5,-y*.5);g.n.push(n.getX(j),n.getZ(j),-n.getY(j));g.uv.push((x+h)/size,(h-y)/size);}}
const boardMaterials=[0,1,2].map(i=>json.materials.push({name:['PCB front artwork','PCB back artwork','FR4 substrate edge'][i],pbrMetallicRoughness:{baseColorFactor:i===2?[.12,.115,.07,1]:[1,1,1,1],metallicFactor:i===2?0:.15,roughnessFactor:i===2?.8:.58,...(i<2?{baseColorTexture:{index:i}}:{})}})-1);
const boardMesh=json.meshes.push({name:'PCB',primitives:boardGroups.map((g,i)=>primitive(g,boardMaterials[i]))})-1;json.scenes[0].nodes.unshift(json.nodes.push({name:'PCB',mesh:boardMesh})-1);
json.buffers=[{byteLength:offset}];let header=Buffer.from(JSON.stringify(json));header=Buffer.concat([header,Buffer.alloc((4-header.length%4)%4,32)]);const bin=Buffer.concat(chunks),output=Buffer.alloc(12+8+header.length+8+bin.length);output.writeUInt32LE(0x46546c67,0);output.writeUInt32LE(2,4);output.writeUInt32LE(output.length,8);output.writeUInt32LE(header.length,12);output.writeUInt32LE(0x4e4f534a,16);header.copy(output,20);let at=20+header.length;output.writeUInt32LE(bin.length,at);output.writeUInt32LE(0x004e4942,at+4);bin.copy(output,at+8);fs.writeFileSync('dist/assets/beagleplay.glb',output);metadata.triangles=totalTriangles;metadata.bytes=output.length;fs.writeFileSync('dist/assets/assembly.json',JSON.stringify(metadata));console.log(`${perPart.size} selectable parts, ${totalTriangles} triangles, ${(output.length/1024/1024).toFixed(1)} MB GLB`);console.log('PCB bounds',minX,maxY,size,'Parts',metadata.parts.filter(p=>/^U1$|^J24$|^J8$/.test(p.ref)));
