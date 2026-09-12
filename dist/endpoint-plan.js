// Only cross an IC using a verified channel map, never inferred net-name similarity.
// TI SN74LVC2G241 datasheet, pin-functions table: 1A(2)/1Y(6), 2A(5)/2Y(3).
export const bufferSource='https://www.ti.com/lit/ds/symlink/sn74lvc2g241.pdf';
export function endpointPlan(data,start){
 if(start.net===null)return {start,nets:[],ends:[],stages:[],shared:false};
 const net=data.nets[start.net],nets=[net],stages=[];
 const shared=/GND|VDD|VCC|VPP|(?:^|_)\dV\d|POWER/i.test(net.name);
 if(!shared)for(const p of net.pads.filter(p=>p.ref==='U10')){
  const other=({'2':'6','6':'2','3':'5','5':'3'})[p.number];
  const q=data.components.U10?.find(q=>q.number===other);
  if(q&&q.net!==null&&q.net!==start.net){nets.push(data.nets[q.net]);stages.push({from:p,to:q,description:'U10 · SN74LVC2G241 buffer channel'});}
 }
 const seen=new Set(),ends=nets.flatMap(n=>n.pads).filter(p=>{const k=p.ref+':'+p.number;if(k===start.ref+':'+start.number||seen.has(k))return false;seen.add(k);return true;});
 const rank=p=>p.ref==='U1'?0:/^U/.test(p.ref)?1:/^J/.test(p.ref)?2:3;
 ends.sort((a,b)=>rank(a)-rank(b)||a.ref.localeCompare(b.ref,undefined,{numeric:true})||a.number.localeCompare(b.number,undefined,{numeric:true}));
 return {start,nets,ends,stages,shared};
}
