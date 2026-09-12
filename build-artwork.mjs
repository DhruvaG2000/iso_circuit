import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
// Interpret the subset of RS-274X emitted by the official Allegro artwork.
// Coordinates are inches with five decimal places; output is engineering SVG.
const factor=25.4/100000;
export function gerber(filename,color){
 const text=fs.readFileSync(filename,'utf8');
 const aps=new Map(),macros=new Map();
 for(const m of text.matchAll(/%AM([^*]+)\*([\s\S]*?)%/g))macros.set(m[1],m[2]);
 for(const m of text.matchAll(/%ADD(\d+)([^,*]+)(?:,([^*]*))?\*%/g))aps.set(Number(m[1]),{shape:m[2],v:(m[3]||'').split('X').map(Number)});
 const cleaned=text.replace(/%[\s\S]*?%/g,'');let x=0,y=0,d=2,ap=10,mode=1,region=false,points=[],out=[];
 const pt=(a,b)=>`${a.toFixed(5)} ${(-b).toFixed(5)}`;
 for(let command of cleaned.split('*')){
  command=command.trim();if(!command||command.startsWith('G04'))continue;
  if(command==='G36'){region=true;points=[];continue;}if(command==='G37'){if(points.length)out.push(`<path d="${points.join(' ')} Z" fill="${color}"/>`);region=false;continue;}
  let match=command.match(/^(?:G54)?D(\d+)$/);if(match&&+match[1]>=10){ap=+match[1];continue;}
  match=command.match(/G0?([123])(?=[XYIJDG]|$)/);if(match)mode=+match[1];
  const nx=command.match(/X(-?\d+)/),ny=command.match(/Y(-?\d+)/),nd=command.match(/D0?([123])$/);
  if(!nx&&!ny&&!nd)continue;if(nd)d=+nd[1];const xx=nx?+nx[1]*factor:x,yy=ny?+ny[1]*factor:y;
  const aperture=aps.get(ap)||{shape:'C',v:[.004]},width=(aperture.v[0]||.004)*25.4;
  let segment=`L ${pt(xx,yy)}`;
  if(mode!==1&&d===1){const i=+(command.match(/I(-?\d+)/)?.[1]||0)*factor,j=+(command.match(/J(-?\d+)/)?.[1]||0)*factor;const radius=Math.hypot(i,j);if(radius){const start=Math.atan2(-j,-i),end=Math.atan2(yy-y-j,xx-x-i);let sweep=mode===2?start-end:end-start;while(sweep<0)sweep+=Math.PI*2;segment=`A ${radius} ${radius} 0 ${sweep>Math.PI?1:0} ${mode===2?1:0} ${pt(xx,yy)}`;}}
  if(d===2&&region)points.push(`M ${pt(xx,yy)}`);
  if(d===1){if(region)points.push(segment);else out.push(`<path d="M ${pt(x,y)} ${segment}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);}
  if(d===3){let shape='';if(aperture.shape==='C')shape=`<circle r="${width/2}"/>`;else if(['R','O'].includes(aperture.shape)){const height=(aperture.v[1]||aperture.v[0])*25.4;shape=`<rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" rx="${aperture.shape==='O'?Math.min(width,height)/2:0}"/>`;}else if(macros.has(aperture.shape)){for(const prim of macros.get(aperture.shape).split('*')){const values=prim.replace(/\s/g,'').split(',').map(Number);if(values[0]===4){const n=values[2],coords=[];for(let k=0;k<=n;k++)coords.push(`${values[3+k*2]*25.4},${-values[4+k*2]*25.4}`);shape+=`<polygon points="${coords.join(' ')}"/>`;}}}if(shape)out.push(`<g fill="${color}" transform="translate(${xx} ${-yy})">${shape}</g>`);}
  x=xx;y=yy;
 }
 return out.join('\n');
}
// Official board-outline coordinates in the same manufacturing origin.
const minX=-1300300*factor,maxY=1237170*factor,size=314970*factor;
fs.mkdirSync('dist/assets',{recursive:true});
for(const side of ['top','bottom']){
 const silk=gerber(`assets-source/silk_${side}.art`,'#d4d9d5');
 const pads=gerber(`assets-source/sold_${side}.art`,'#c3ae79');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="4096" viewBox="${minX} ${-maxY} ${size} ${size}"><rect x="${minX}" y="${-maxY}" width="${size}" height="${size}" fill="#171b20"/>${pads}${silk}</svg>`;
 fs.writeFileSync(`dist/assets/pcb-${side}.svg`,svg);
 fs.writeFileSync(`dist/assets/pcb-${side}.png`,new Resvg(svg).render().asPng());
}
console.log('Built front/back PCB textures from official Gerber artwork.');
