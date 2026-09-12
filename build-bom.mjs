import fs from 'node:fs';
function parseCSV(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=c;}if(cell||row.length){row.push(cell);rows.push(row);}return rows;}
const rows=parseCSV(fs.readFileSync('assets-source/bom.csv','utf8')),bom={};
const known={U1:['Application processor','am625'],U9:['Wireless microcontroller','cc1352p7'],U5:['Dual-band Wi-Fi module','wl1807mod'],U13:['Single-pair Ethernet PHY','dp83td510e'],U16:['1.0 V regulator','tlv758p'],U12:['3.3 V step-down converter','tlv62595'],U17:['Power management IC','tps65219'],U11:['Two-channel 10-bit ADC','adc102s021'],U18:['Real-time clock','bq32002'],U22:['Power protection eFuse','tps25200'],U21:['Load switch','tps22918'],U8:['USB power switch & protection','tpd3s014'],U10:['Dual buffer / line driver','sn74lvc2g241']};
for(const row of rows.slice(1))for(const ref of (row[4]||'').split(/\s+/).filter(Boolean)){
 const description=row[0].replace(/^\d+,\s*/,'').replace(/,\s*[AB]\.\d+ \(Design\)$/,'');
 const mpn=ref==='U9'?'CC1352P7':row[2].trim();
 bom[ref]={ref,description,manufacturer:row[1],mpn,name:known[ref]?.[0]||description.split(';')[0].replace(/^SMD |^DIP /,''),datasheet:known[ref]?`https://www.ti.com/lit/ds/symlink/${known[ref][1]}.pdf`:null};
 if(mpn){bom[ref].mouser=`https://www.mouser.com/c/?q=${encodeURIComponent(mpn)}`;bom[ref].digikey=`https://www.digikey.com/en/products/result?keywords=${encodeURIComponent(mpn)}`;}
}
const extra={U6:['Gigabit Ethernet PHY',null],U7:['HDMI transmitter',null],U2:['2 GB DDR4 RAM',null],U3:['16 GB eMMC flash',null],U20:['Board ID EEPROM',null],J21:['mikroBUS socket',null]};
for(const [ref,[name,manufacturerURL]]of Object.entries(extra)){if(bom[ref])Object.assign(bom[ref],{name,manufacturerURL});}
const functions=JSON.parse(fs.readFileSync('assets-source/component-functions.json','utf8'));
for(const [ref,data]of Object.entries(functions))if(bom[ref]){bom[ref].specification=bom[ref].description;bom[ref].description=data.description;if(/^J|^SW/.test(ref))bom[ref].name=data.name;}
if(bom.U11)bom.U11.description='Converts two analog inputs into digital measurements using the ADC102S021. Its serial interface connects to the processor; the expansion inputs are separate channels.';
if(bom.U17)bom.U17.description='TPS6521903 manages the board power sequence and generates several processor, memory and I/O supply rails. Its configuration interface connects to the local I²C bus.';
fs.writeFileSync('dist/assets/bom.json',JSON.stringify(bom));
console.log('Catalogued',Object.keys(bom).length,'BOM components.');
