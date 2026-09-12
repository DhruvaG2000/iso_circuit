import fs from 'node:fs';
import CFB from 'cfb';

// Altium compound-file records. Coordinates are 1/10000 mil.
const file=CFB.read(fs.readFileSync('assets-source/beagleplay.PcbDoc'),{type:'buffer'});
const stream=name=>Buffer.from(file.FileIndex[file.FullPaths.findIndex(p=>p.endsWith('/'+name+'/Data'))].content);
function records(name,count=1){const b=stream(name),out=[];let o=0;while(o<b.length){const type=b[o++],subs=[];for(let i=0;i<count;i++){const n=b.readUInt32LE(o);o+=4;if(o+n>b.length)throw Error(`${name}: invalid record`);subs.push(b.subarray(o,o+n));o+=n;}out.push({type,subs});}return out;}
function properties(name){const b=stream(name),out=[];let o=0;while(o<b.length){const n=b.readUInt32LE(o);o+=4;out.push(Object.fromEntries(b.subarray(o,o+n).toString('latin1').replace(/\0/g,'').split('|').filter(s=>s.includes('=')).map(s=>[s.slice(0,s.indexOf('=')),s.slice(s.indexOf('=')+1)])));o+=n;}return out;}
const round=n=>Math.round(n*100000)/100000;
const pos=(b,o)=>[round((b.readInt32LE(o)*.00000254+290.27501)*.5),round(-(b.readInt32LE(o+4)*.00000254-274.23999)*.5)];
const size=(b,o)=>round(b.readInt32LE(o)*.00000127);
const nets=properties('Nets6').map((n,id)=>({id,name:n.NAME,tracks:[],vias:[],pads:[]}));
const refs={};
for(const {subs:[b,t]} of records('Texts6',2))if(b.length>42&&b[41])refs[b.readUInt16LE(7)]=t.subarray(1,1+t[0]).toString('latin1');
const components={};
for(const {subs} of records('Pads6',6)){const [name,,, ,b]=subs;if(b.length<63)continue;const ref=refs[b.readUInt16LE(7)];if(!ref)continue;const number=name.subarray(1,1+name[0]).toString('latin1');const net=b.readUInt16LE(3),[x,z]=pos(b,13);const pad={ref,number,net:nets[net]?net:null,x,z,layer:b[0],width:size(b,21),height:size(b,25),hole:size(b,45)};(components[ref]??=[]).push(pad);if(nets[net])nets[net].pads.push(pad);}
for(const {subs:[b]} of records('Tracks6')){const net=nets[b.readUInt16LE(3)],layer=b[0];if(!net||layer>32||(b[1]&2)||b[2]===2)continue;net.tracks.push([layer,...pos(b,13),...pos(b,21),size(b,29)]);}
for(const {subs:[b]} of records('Arcs6')){const net=nets[b.readUInt16LE(3)],layer=b[0];if(!net||layer>32||(b[1]&2)||b[2]===2)continue;const [x,z]=pos(b,13),r=size(b,21);let a=b.readDoubleLE(25),end=b.readDoubleLE(33);if(end<=a)end+=360;const steps=Math.ceil((end-a)/5),point=t=>[round(x+r*Math.cos(t*Math.PI/180)),round(z-r*Math.sin(t*Math.PI/180))];for(let i=0;i<steps;i++)net.tracks.push([layer,...point(a+(end-a)*i/steps),...point(a+(end-a)*(i+1)/steps),size(b,41)]);}
for(const {subs:[b]} of records('Vias6')){const net=nets[b.readUInt16LE(3)];if(net)net.vias.push([...pos(b,13),size(b,21),b[29],b[30]]);}
for(const pins of Object.values(components))pins.sort((a,b)=>a.number.localeCompare(b.number,undefined,{numeric:true}));
const layers=[...new Set(nets.flatMap(n=>n.tracks.map(t=>t[0])))].sort((a,b)=>a-b);
const output={source:'Official BeaglePlay Altium export, BEAGLEPLAYV020_220915.brd.PcbDoc',limitations:'Tracks, pads and vias; copper pours and plane fills are not rendered. Export revision can differ from the assembly.',layers,components,nets};
fs.writeFileSync('dist/assets/routing.json',JSON.stringify(output));
console.log(JSON.stringify({components:Object.keys(components).length,nets:nets.length,layers,tracks:nets.reduce((s,n)=>s+n.tracks.length,0),serial:components.J6?.map(p=>({...p,name:nets[p.net]?.name}))},null,2));
