import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {connections} from './dist/connections.js';
const root=path.resolve('dist'),html=fs.readFileSync('dist/index.html','utf8');
const bom=JSON.parse(fs.readFileSync('dist/assets/bom.json')),assembly=JSON.parse(fs.readFileSync('dist/assets/assembly.json'));
const glb=fs.readFileSync('dist/assets/beagleplay.glb');
assert.equal(glb.readUInt32LE(0),0x46546c67,'Valid GLB magic');assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);
assert(glb.length<8*1024*1024,'Compressed model must stay below 8 MiB');
const gltf=JSON.parse(glb.subarray(20,20+glb.readUInt32LE(12)).toString());
const refs=gltf.nodes.filter(n=>n.extras?.ref).map(n=>n.extras.ref);assert.equal(new Set(refs).size,refs.length,'Unique component identities');assert.equal(refs.length,assembly.parts.length);assert(refs.length>750,'Detailed assembly is present');
for(const p of assembly.parts)assert(p.center.every(Number.isFinite)&&p.center.every(v=>Math.abs(v)<50),`${p.ref}: valid placement`);
for(const ref of ['U1','U2','U3','U5','J24','J14','J21'])assert(refs.includes(ref),`${ref} must be selectable`);
assert.equal(Object.keys(bom).length,725);assert.equal(bom.U11.mpn,'ADC102S021CIMMX/NOPB');assert.equal(bom.U17.mpn,'TPS6521903RHBR');
for(const n of connections){assert(n.refs.length>1);assert.equal(new Set(n.refs).size,n.refs.length);assert(n.refs.every(r=>refs.includes(r)||bom[r]),`${n.id}: known endpoint`);}
assert.deepEqual(connections.find(n=>n.id==='usbpower').refs,['U8','J13']);
assert.deepEqual(connections.find(n=>n.id==='spepower').refs,['U21','J2']);
assert(html.includes('<title>BeaglePlay — Inside the board</title>'));
const imported=new Set();
function checkModule(file){if(imported.has(file))return;imported.add(file);const text=fs.readFileSync(file,'utf8');for(const m of text.matchAll(/^import\s+(?:\{[\s\S]*?\}|[^\n]+?)\s+from\s*['"]([^'"]+)['"]/gm)){const spec=m[1];if(spec==='three'){checkModule(path.join(root,'vendor/three.module.js'));continue;}assert(spec.startsWith('.'),`Self-hosted module: ${spec}`);const target=path.resolve(path.dirname(file),spec);assert(fs.existsSync(target),`Missing module: ${target}`);checkModule(target);}}
checkModule(path.join(root,'viewer.js'));
for(const image of gltf.images||[])if(image.uri)assert(fs.existsSync(path.join(root,'assets',image.uri)),'Local texture exists');
assert(html.includes('./viewer.js')&&html.includes('./style.css'),'Entry resources are relative for project Pages');
assert(!/(?:src|href)="\/(?!\/)/.test(html),'No root-absolute resource URLs');
// Serve beneath a repository path, just as GitHub project Pages does.
const child=spawn(process.execPath,['server.cjs'],{env:{...process.env,PORT:'4187',BASE_PATH:'/beagleplay-test'},stdio:['ignore','pipe','pipe']});
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Preview server startup timed out')),5000);child.once('error',reject);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('exit',code=>{if(code)reject(Error('Server exited '+code));});});
 const base='http://127.0.0.1:4187/beagleplay-test/';
 for(const [file,type]of [['','text/html'],['viewer.js','text/javascript'],['vendor/meshopt_decoder.js','text/javascript'],['assets/beagleplay.glb','model/gltf-binary'],['assets/bom.json','application/json']]){const response=await fetch(base+file);assert.equal(response.status,200,file);assert(response.headers.get('content-type').includes(type),`Correct MIME for ${file}`);await response.arrayBuffer();}
 assert.equal((await fetch(base+'assets/missing.glb')).status,404);
}finally{child.kill();}
console.log(`PASS: ${refs.length} model components, ${Object.keys(bom).length} BOM entries, ${connections.length} functional bundles, ${(glb.length/1024/1024).toFixed(2)} MiB model. Module graph, resources and project-path serving verified.`);
