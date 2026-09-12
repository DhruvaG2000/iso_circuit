import fs from 'node:fs';
const files={'beagleplay.stp':'Design/beagleplayv10_a2_board_3D_20221219.stp','bom.csv':'BeaglePlay_bom.csv','HARDWARE-LICENSE.txt':'LICENSE','component-locations.xlsx':'Design/319015424_Beagleplay_Rev_A2_location.xlsx'};
for(const name of ['silk_top','silk_bottom','sold_top','sold_bottom','outline'])files[name+'.art']='MFG/gerber_beagleplayv022_230215/'+name+'.art';
fs.mkdirSync('assets-source',{recursive:true});
for(const [local,remote]of Object.entries(files)){const target='assets-source/'+local;if(fs.existsSync(target))continue;const url=`https://openbeagle.org/api/v4/projects/beagleplay%2Fbeagleplay/repository/files/${encodeURIComponent(remote)}/raw?ref=main`;const response=await fetch(url);if(!response.ok)throw Error(`${remote}: HTTP ${response.status}`);fs.writeFileSync(target,new Uint8Array(await response.arrayBuffer()));console.log('Downloaded',local);}
