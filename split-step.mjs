import fs from 'node:fs';
import {Matrix4,Vector3} from './dist/vendor/three.module.js';
const raw=fs.readFileSync('assets-source/beagleplay.stp','utf8'),entities=new Map([...raw.matchAll(/#(\d+)\s*=([\s\S]*?);/g)].map(m=>[+m[1],m[2].replace(/\s+/g,' ')]));
const refs=s=>[...(s||'').matchAll(/#(\d+)/g)].map(m=>+m[1]);
const srByPD=new Map(),pdsByPD=new Map(),relations=new Map(),occ=[],occTransforms=new Map();
for(const [id,e]of entities){if(e.startsWith('PRODUCT_DEFINITION_SHAPE'))pdsByPD.set(refs(e)[0],id);if(e.startsWith('NEXT_ASSEMBLY')){const r=refs(e);if(r[0]===750993)occ.push({id,ref:e.match(/'([^']+)'/)[1],pd:r[1]});}if(e.includes('REPRESENTATION_RELATIONSHIP_WITH_TRANSFORMATION')){const r=refs(e);if(!relations.has(r[0]))relations.set(r[0],[]);relations.get(r[0]).push({rep:r[1],transform:r[2]});}else if(e.startsWith('SHAPE_REPRESENTATION_RELATIONSHIP')){const r=refs(e);if(!relations.has(r[0]))relations.set(r[0],[]);relations.get(r[0]).push({rep:r[1]});}}
for(const e of entities.values())if(e.startsWith('CONTEXT_DEPENDENT_SHAPE_REPRESENTATION')){const r=refs(e),occId=refs(entities.get(r[1]))[0];occTransforms.set(occId,refs(entities.get(r[0]))[2]);}
for(const [id,e]of entities)if(e.startsWith('SHAPE_DEFINITION_REPRESENTATION')){const r=refs(e);srByPD.set(refs(entities.get(r[0]))[0],r[1]);}
function tuple(id){return entities.get(id).match(/\(([-\d.E+, ]+)\)\)$/)[1].split(',').map(Number);}
function axis(id){const r=refs(entities.get(id)),p=tuple(r[0]),z=r[1]?new Vector3(...tuple(r[1])):new Vector3(0,0,1),x=r[2]?new Vector3(...tuple(r[2])):new Vector3(1,0,0),y=new Vector3().crossVectors(z,x).normalize();return new Matrix4().makeBasis(x,y,z).setPosition(...p);}
function transform(id){if(!id)return new Matrix4();const r=refs(entities.get(id));return axis(r[0]).multiply(axis(r[1]).invert());}
const files=new Map(),instances=[];
function walk(rep,matrix,ref,seen=new Set()){
 if(seen.has(rep))return;seen=new Set(seen);seen.add(rep);
 const e=entities.get(rep);if(!e)return;
 if(/^(ADVANCED_BREP|MANIFOLD_SURFACE|GEOMETRICALLY_BOUNDED_SURFACE)_SHAPE_REPRESENTATION/.test(e)||(/^SHAPE_REPRESENTATION/.test(e)&&refs(e).some(r=>/MANIFOLD_SOLID|SHELL_BASED/.test(entities.get(r)||'')))){
  files.set(rep,true);instances.push({ref,rep,matrix:matrix.toArray()});
 }
 for(const rel of relations.get(rep)||[])walk(rel.rep,matrix.clone().multiply(transform(rel.transform)),ref,seen);
}
for(const item of occ){const rep=srByPD.get(item.pd);walk(rep,transform(occTransforms.get(item.id)),item.ref);}
fs.mkdirSync('assets-source/split',{recursive:true});
for(const rep of files.keys()){
 const needed=new Set();function dep(id){if(needed.has(id)||!entities.has(id))return;needed.add(id);for(const r of refs(entities.get(id)))dep(r);}dep(rep);
 // Minimal product structure, avoiding the source's empty placeholder assemblies.
 const styles=[];for(const [id,e]of entities)if(e.startsWith('STYLED_ITEM')&&needed.has(refs(e).at(-1))){styles.push(id);dep(id);}
 const context=refs(entities.get(rep)).at(-1);
 const extra=`#2000001=APPLICATION_CONTEXT('automotive_design');\n#2000002=PRODUCT_CONTEXT('',#2000001,'mechanical');\n#2000003=PRODUCT('part','part','',(#2000002));\n#2000004=PRODUCT_DEFINITION_FORMATION('','',#2000003);\n#2000005=PRODUCT_DEFINITION_CONTEXT('part definition',#2000001,'design');\n#2000006=PRODUCT_DEFINITION('design','',#2000004,#2000005);\n#2000007=PRODUCT_DEFINITION_SHAPE('','',#2000006);\n#2000008=SHAPE_DEFINITION_REPRESENTATION(#2000007,#${rep});`+(styles.length?`\n#2000009=MECHANICAL_DESIGN_GEOMETRIC_PRESENTATION_REPRESENTATION('',(${styles.map(s=>'#'+s).join(',')}),#${context});`:'');
 fs.writeFileSync(`assets-source/split/${rep}.stp`,raw.slice(0,raw.indexOf('DATA;')+5)+'\n'+[...needed].map(id=>`#${id}=${entities.get(id)};`).join('\n')+'\n'+extra+'\nENDSEC;\nEND-ISO-10303-21;');
}
fs.writeFileSync('assets-source/cad-instances.json',JSON.stringify(instances,null,2));console.log('Components',occ.length,'instances',instances.length,'unique geometries',files.size,instances.slice(0,6));
