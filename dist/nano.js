const parts=[];
function part(id,name,model,group,x,z,w,d,h,description,tags=[],kind='chip'){const p={id,name,model,group,x,z,w,d,h,description,tags,kind};parts.push(p);return p;}
part('mcu','Processor & Bluetooth','U1 · u-blox NINA-B306','CORE',11,0,14,10,2.5,'The module contains the Nordic nRF52840 processor and Bluetooth radio. It runs your sketch, reads the sensors, and controls the header pins. The antenna is integrated into the module.',['64 MHz Cortex-M4F','1 MB flash','256 KB RAM'],'module');
part('usb','Micro-USB','J1 · USB Micro-B','CORE',-20,0,7,7.5,2.5,'Connects the board to a computer for programming and USB communication. VUSB supplies the power circuit through a Schottky diode. USB data goes directly to the nRF52840.',['USB 2.0','5 V input'],'usb');
part('imu','Motion sensor','U2 · LSM9DS1','SENSORS',-1.5,3.2,4,3.5,1,'Measures acceleration, angular velocity, and magnetic field in three axes. Its two I²C devices share the internal sensor bus.',['9 axes','I²C 0x6B / 0x1E']);
part('gesture','Light & gesture','U5 · APDS-9960','SENSORS',-7,2.8,4,2.5,1.1,'Measures RGB and ambient light, detects proximity, and senses gestures using an infrared emitter and photodiodes. A separate interrupt line reports events to the processor.',['I²C 0x39','INT_APDS'],'optical');
part('mic','Microphone','U3 · MP34DT06J / MP34DT05','SENSORS',-10,-3,3.8,3,1.3,'Converts sound into a pulse-density modulated digital stream. The processor supplies the clock and reads PDM data. Part marking can vary by production revision; the linked V4.0 schematic specifies MP34DT06JTR.',['PDM audio','Omnidirectional'],'mic');
part('humidity','Humidity & temperature','HS1 · HTS221','SENSORS',-3.8,-3,2.8,2.5,0.9,'Measures relative humidity and ambient temperature. It shares SDA1 and SCL1 with the other onboard I²C sensors and uses the switched environmental supply.',['I²C 0x5F'],'metal');
part('pressure','Barometric pressure','LPS1 · LPS22HB','SENSORS',1,-3,2.8,2.8,0.9,'Measures air pressure for weather or relative-altitude applications. Communicates on the internal I²C bus. Its pressure port must remain exposed to ambient air.',['I²C 0x5C'],'metal');
part('regulator','Voltage regulator','IC1 · MPM3610','POWER & CONTROL',-14,3.3,3.8,3,1.4,'A step-down regulator converts VIN into the board’s 3.3 V supply. It includes an inductor; external capacitors and feedback resistors stabilize and set the output.',['3.3 V output','Buck converter']);
part('reset','Reset button','PB1 · RESETN','POWER & CONTROL',-14,-3.4,3.6,3.4,1.5,'Pressing the button connects RESETN to ground and resets the processor. The same net reaches both reset header pins and the debug pads.',['Active low'],'button');
part('rgb','RGB LED','DL3 · Red / green / blue','POWER & CONTROL',4,3.4,1.8,1.8,0.6,'Three LED channels are driven by separate processor outputs through 1 kΩ resistors. The common anode is connected to 3.3 V; channels turn on when their GPIO goes low.',['Active low','LEDR / LEDG / LEDB'],'led');
part('led','Built-in LED','DL1 · Yellow','POWER & CONTROL',-17,4.5,1.4,0.9,0.5,'The yellow user LED is connected to D13 / SPI clock through a 330 Ω resistor. SPI activity can therefore toggle this LED.',['LED_BUILTIN','D13'],'led');
part('powerled','Power indicator','DL2 · Green','POWER & CONTROL',-17,-5.2,1.4,0.9,0.5,'The green indicator is controlled by the processor through a 330 Ω resistor. The board core defines a dedicated LED_PWR pin.',['LED_PWR'],'led');
part('diode','USB power diode','D2 · PMEG6020','POWER & CONTROL',-17.5,2.5,1.5,1,0.6,'A Schottky diode feeds the VIN rail from VUSB and prevents VIN from feeding back into the USB power input.',['VUSB → VIN']);
part('esd','USB protection','D1 · PRTR5V','POWER & CONTROL',-15,0,1.5,1.5,0.5,'Protects the USB data lines against electrostatic transients. Connected to D+, D−, VUSB, and ground.',['ESD protection']);
part('debug','Debug pads','J3 · SWD','UNDERSIDE',12,0,5,4,0.15,'Underside test pads expose SWDIO, SWCLK, RESETN, 3.3 V, and ground for programming and debugging with an external probe.',['5 populated pads'],'pads');
part('sj1','USB power jumper','SJ1 · VUSB','UNDERSIDE',-10,2.5,2,1.4,0.1,'Normally open. Bridging this jumper connects USB VBUS to the header VUSB pin. The pin is disconnected by default.',['Normally open'],'jumper');
part('sj4','3.3 V jumper','SJ4 · +3V3','UNDERSIDE',-5,2.5,2,1.4,0.1,'Links the regulator output to the 3.3 V rail. The V4.0 schematic calls this SJ4; silkscreen numbering can differ with revision.',['Normally closed'],'jumper');
part('sj2','D7 / NFC jumper','SJ2 · D7','UNDERSIDE',5,2.5,2,1.4,0.1,'Connects the module NFC-capable signal to the D7 header. Consult the board schematic before modifying this link.',['D7'],'jumper');
part('sj3','D8 / NFC jumper','SJ3 · D8','UNDERSIDE',8,2.5,2,1.4,0.1,'Connects the module NFC-capable signal to the D8 header. Consult the board schematic before modifying this link.',['D8'],'jumper');
part('caps','Decoupling capacitors','C5–C14 · Sensor and module bypass','SUPPORT CIRCUITS',-0.5,-5.4,6,0.9,0.4,'Local capacitors keep sensor and module supply voltages stable. This selectable group represents the bypass and sensor-support capacitors; internal sensor CAP nodes are not expanded into separate nets.',['Grouped circuit'],'passives');
part('feedback','Regulator support','C3/C4 · R6/R8/R9/R10','SUPPORT CIRCUITS',-11,5.3,5,0.9,0.4,'Input/output capacitors, feedback divider, and regulator configuration resistors support the MPM3610. Shown as a functional group rather than individual internal feedback nets.',['Grouped circuit'],'passives');
part('pullups','I²C pull-up resistors','R13 / R14 · 4.7 kΩ','SUPPORT CIRCUITS',2,5.2,2.2,0.8,0.4,'Pull SDA1 and SCL1 high through resistors. Their supply is controlled by the processor’s R_PULLUP output. I²C devices pull the lines low to communicate.',['4.7 kΩ × 2'],'passives');
part('ledres','LED resistors','R1/R7/R11 · 1 kΩ; R2/R3 · 330 Ω','SUPPORT CIRCUITS',5,-5.1,4,0.8,0.4,'Limit current through the RGB, green, and yellow LEDs. The 3D network groups these five series resistors.',['Grouped circuit'],'passives');
const topPins=['D13','3V3','AREF','A0','A1','A2','A3','A4','A5','A6','A7','VUSB','RST','GND','VIN'];
const bottomPins=['D12','D11','D10','D9','D8','D7','D6','D5','D4','D3','D2','GND','RST','RX','TX'];
const functions={D13:'GPIO / SPI SCK',D12:'GPIO / SPI MISO',D11:'GPIO / SPI MOSI',D10:'GPIO / SPI chip select',A4:'External I²C SDA',A5:'External I²C SCL',RX:'UART receive',TX:'UART transmit',AREF:'Analog reference / GPIO',VIN:'Regulator supply input',VUSB:'USB supply via normally-open SJ1',RST:'Active-low reset',GND:'Common ground','3V3':'Regulated 3.3 V'};
for(const [row,names] of [topPins,bottomPins].entries())names.forEach((name,i)=>part(`pin-${row}-${i}`,name,`HEADER · ${functions[name]||(/^A/.test(name)?'Analog input / GPIO':'Digital GPIO')}`,'HEADER PINS',17.78-i*2.54,row===0?7.62:-7.62,1.7,1.7,.25,functions[name]?`${functions[name]}. ${name==='VUSB'?'This header is isolated until SJ1 is bridged.':name==='GND'?'Shared electrical reference for the board.':'See the highlighted net for its board connection.'}`:'A 3.3 V processor input/output. Analog inputs support ADC measurements; the nRF52840 has no analog DAC output.',['3.3 V logic','Not 5 V tolerant'],'pin'));
const nets=[];
function net(id,name,type,ids,info){nets.push({id,name,type,ids,info});}
const sensors=['imu','gesture','humidity','pressure'];
net('sda1','SDA1 · internal sensor data','signal',['mcu',...sensors,'pullups'],'Wire1 · nRF52840 P0.14. Shared by the onboard sensors.');
net('scl1','SCL1 · internal sensor clock','signal',['mcu',...sensors,'pullups'],'Wire1 · nRF52840 P0.15. Separate from external A4/A5.');
net('env','VDD_ENV · sensor supply','power',['mcu','imu','humidity','pressure','caps'],'Switched sensor supply from processor P0.22.');
net('interrupt','INT_APDS · gesture interrupt','signal',['mcu','gesture'],'Gesture/proximity interrupt → P0.19.');
net('pdmclk','PDMCLK · microphone clock','audio',['mcu','mic'],'Processor P0.26 → microphone CLK.');
net('pdmin','PDMDIN · microphone data','audio',['mcu','mic'],'Microphone DOUT → processor P0.25.');
net('micpower','MIC_PWR · microphone supply','power',['mcu','mic'],'Microphone supply controlled by P0.17.');
net('pullup','R_PULLUP · pull-up enable','power',['mcu','pullups'],'Processor P1.00 supplies the two bus pull-up resistors.');
net('usbplus','USB D+','audio',['usb','esd','mcu'],'USB differential positive data line.');
net('usbminus','USB D−','audio',['usb','esd','mcu'],'USB differential negative data line.');
net('vusb','VUSB · USB input','power',['usb','diode','esd','sj1','mcu'],'USB supply before the Schottky diode; also reaches module VBUS.');
net('vin','VIN · regulator input','power',['diode','regulator','feedback',...parts.filter(p=>p.name==='VIN').map(p=>p.id)],'USB through D2, or external VIN → regulator input.');
net('3v3','+3V3 · board supply','power',['regulator','sj4','mcu','gesture','rgb','debug','feedback','caps',...parts.filter(p=>p.name==='3V3').map(p=>p.id)],'Regulated board supply through the closed 3.3 V jumper.');
net('reset','RESETN','signal',['mcu','reset','debug',...parts.filter(p=>p.name==='RST').map(p=>p.id)],'Reset switch shorts this active-low line to ground.');
net('swdio','SWDIO','signal',['mcu','debug'],'Serial Wire Debug data.');net('swclk','SWCLK','signal',['mcu','debug'],'Serial Wire Debug clock.');
net('rgb-r','RGB red · LR','signal',['mcu','ledres','rgb'],'P0.24 through R7, 1 kΩ. Active low.');net('rgb-g','RGB green · LG','signal',['mcu','ledres','rgb'],'P0.16 through R11, 1 kΩ. Active low.');net('rgb-b','RGB blue · LB','signal',['mcu','ledres','rgb'],'P0.06 through R1, 1 kΩ. Active low.');
net('pwrled','Green LED control','signal',['mcu','ledres','powerled'],'Processor output through R2, 330 Ω.');
for(const p of parts.filter(p=>p.kind==='pin')){if(['VIN','3V3','GND','RST'].includes(p.name))continue;let ids=['mcu',p.id];let info=functions[p.name]||'Header connects to the processor GPIO.';if(p.name==='VUSB'){ids=['sj1',p.id];info='Open circuit by default; requires solder bridge SJ1 to reach VUSB.';}if(p.name==='D13')ids.push('led','ledres');if(p.name==='D7')ids.push('sj2');if(p.name==='D8')ids.push('sj3');net('header-'+p.id,p.name+' · '+(functions[p.name]||'GPIO'),['VUSB'].includes(p.name)?'power':'signal',ids,info);}
net('gnd','GND · common reference','ground',['mcu','usb','imu','gesture','mic','humidity','pressure','regulator','reset','led','powerled','esd','debug','caps','feedback',...parts.filter(p=>p.name==='GND').map(p=>p.id)],'Shared ground plane. This overlay is a logical connection, not a routed wire.');


export { parts, nets };
