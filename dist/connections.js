// Functional bus bundles derived from the BeaglePlay documentation and Linux device tree.
// These are not exact copper routes or individual passive nets.
export const connections=[
  {
    "id": "wifi1-rf",
    "name": "Wi-Fi antenna 1 · RF path",
    "type": "audio",
    "info": "RF feed through matching circuitry; this is not a GPIO signal.",
    "refs": [
      "U5",
      "J5"
    ]
  },
  {
    "id": "wifi2-rf",
    "name": "Wi-Fi antenna 2 · RF path",
    "type": "audio",
    "info": "RF feed through matching circuitry; this is not a GPIO signal.",
    "refs": [
      "U5",
      "J3"
    ]
  },
  {
    "id": "rf24-rf",
    "name": "2.4 GHz antenna · RF path",
    "type": "audio",
    "info": "RF feed through matching circuitry; this is not a GPIO signal.",
    "refs": [
      "U9",
      "J9"
    ]
  },
  {
    "id": "rfsub-rf",
    "name": "Sub-GHz antenna · RF path",
    "type": "audio",
    "info": "RF feed through matching circuitry; this is not a GPIO signal.",
    "refs": [
      "U9",
      "J12"
    ]
  },
  {
    "id": "ddr",
    "name": "DDR4 · memory bus",
    "type": "signal",
    "info": "Dedicated address, command, data and clock bundle.",
    "refs": [
      "U1",
      "U2"
    ]
  },
  {
    "id": "emmc",
    "name": "MMC0 · eMMC",
    "type": "signal",
    "info": "Eight data lines plus command and clock.",
    "refs": [
      "U1",
      "U3"
    ]
  },
  {
    "id": "sd",
    "name": "MMC1 · microSD",
    "type": "signal",
    "info": "SD data, command, clock and card-detect functions.",
    "refs": [
      "U1",
      "J1"
    ]
  },
  {
    "id": "sdio",
    "name": "MMC2 / SDIO · Wi-Fi",
    "type": "signal",
    "info": "Host interface to WL1807MOD; control signals are grouped.",
    "refs": [
      "U1",
      "U5"
    ]
  },
  {
    "id": "radio",
    "name": "UART6 · wireless MCU",
    "type": "signal",
    "info": "Serial communication to CC1352P7; reset and boot control are additional GPIO signals.",
    "refs": [
      "U1",
      "U9"
    ]
  },
  {
    "id": "rgmii",
    "name": "RGMII · Gigabit MAC ↔ PHY",
    "type": "signal",
    "info": "Processor Ethernet MAC to RTL8211F.",
    "refs": [
      "U1",
      "U6"
    ]
  },
  {
    "id": "rmii",
    "name": "RMII · single-pair MAC ↔ PHY",
    "type": "signal",
    "info": "Processor Ethernet MAC to DP83TD510E.",
    "refs": [
      "U1",
      "U13"
    ]
  },
  {
    "id": "mdio",
    "name": "MDIO / MDC · PHY management",
    "type": "signal",
    "info": "Shared management interface for the Ethernet PHYs.",
    "refs": [
      "U1",
      "U6",
      "U13"
    ]
  },
  {
    "id": "ethernet",
    "name": "Ethernet · four twisted pairs",
    "type": "audio",
    "info": "PHY ↔ RJ45 through integrated magnetics.",
    "refs": [
      "U6",
      "J24"
    ]
  },
  {
    "id": "spe",
    "name": "10BASE-T1L · single pair",
    "type": "audio",
    "info": "PHY ↔ RJ11 through coupling and termination circuitry.",
    "refs": [
      "U13",
      "J2"
    ]
  },
  {
    "id": "usb0",
    "name": "USB0 · device D+ / D−",
    "type": "audio",
    "info": "USB device data pair, separate from connector power.",
    "refs": [
      "U1",
      "J14"
    ]
  },
  {
    "id": "usb1",
    "name": "USB1 · host D+ / D−",
    "type": "audio",
    "info": "USB host data pair for attached peripherals.",
    "refs": [
      "U1",
      "J13"
    ]
  },
  {
    "id": "rgb",
    "name": "DSS · 24-bit RGB display",
    "type": "signal",
    "info": "Parallel pixel, sync and clock bundle.",
    "refs": [
      "U1",
      "U7"
    ]
  },
  {
    "id": "audio",
    "name": "McASP1 · digital audio",
    "type": "audio",
    "info": "Serial audio supplied to the HDMI transmitter.",
    "refs": [
      "U1",
      "U7"
    ]
  },
  {
    "id": "hdmi",
    "name": "HDMI · TMDS / DDC / HPD",
    "type": "audio",
    "info": "HDMI differential lanes and display control signals, grouped.",
    "refs": [
      "U7",
      "J4"
    ]
  },
  {
    "id": "i2c2",
    "name": "I²C2 · HDMI control",
    "type": "signal",
    "info": "Configuration interface to the IT66121 transmitter.",
    "refs": [
      "U1",
      "U7"
    ]
  },
  {
    "id": "oldi",
    "name": "OLDI · display lanes",
    "type": "audio",
    "info": "LVDS pixel and clock lanes; panel power/control is grouped separately.",
    "refs": [
      "U1",
      "J8"
    ]
  },
  {
    "id": "csi",
    "name": "CSI-2 · camera lanes",
    "type": "audio",
    "info": "Differential image-data and clock lanes.",
    "refs": [
      "U1",
      "J17"
    ]
  },
  {
    "id": "camera-control",
    "name": "WKUP_I2C0 · camera control",
    "type": "signal",
    "info": "Camera configuration bus, separate from CSI image data.",
    "refs": [
      "U1",
      "J17"
    ]
  },
  {
    "id": "grove",
    "name": "I²C1 · Grove",
    "type": "signal",
    "info": "Expansion clock and data; alternate pin functions require software configuration.",
    "refs": [
      "U1",
      "J7"
    ]
  },
  {
    "id": "qwiic",
    "name": "MCU_I2C0 · Qwiic",
    "type": "signal",
    "info": "3.3 V I²C clock and data interface.",
    "refs": [
      "U1",
      "J18"
    ]
  },
  {
    "id": "mk-i2c",
    "name": "I²C3 · mikroBUS",
    "type": "signal",
    "info": "Separate clock and data conductors shown as one bus.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "mk-spi",
    "name": "SPI2 · mikroBUS",
    "type": "signal",
    "info": "Clock, chip select, input and output data bundle.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "mk-uart",
    "name": "UART5 · mikroBUS",
    "type": "signal",
    "info": "Separate receive and transmit paths.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "mk-PWM",
    "name": "PWM · mikroBUS control",
    "type": "signal",
    "info": "Expansion control signal; actual mux and direction depend on software.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "mk-RST",
    "name": "RST · mikroBUS control",
    "type": "signal",
    "info": "Expansion control signal; actual mux and direction depend on software.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "mk-INT",
    "name": "INT · mikroBUS control",
    "type": "signal",
    "info": "Expansion control signal; actual mux and direction depend on software.",
    "refs": [
      "U1",
      "J21"
    ]
  },
  {
    "id": "adc-spi",
    "name": "SPI · ADC conversion data",
    "type": "signal",
    "info": "Serial interface for the external analog converter.",
    "refs": [
      "U1",
      "U11"
    ]
  },
  {
    "id": "analog",
    "name": "Analog · expansion inputs",
    "type": "signal",
    "info": "Two ADC channels are grouped; the analog inputs are not shorted together.",
    "refs": [
      "U11",
      "J7",
      "J21"
    ]
  },
  {
    "id": "local-i2c",
    "name": "I²C0 · board management",
    "type": "signal",
    "info": "Shared bus to RTC, board EEPROM and power management.",
    "refs": [
      "U1",
      "U18",
      "U20",
      "U17"
    ]
  },
  {
    "id": "backup",
    "name": "RTC backup supply",
    "type": "power",
    "info": "Coin-cell backup supply only.",
    "refs": [
      "J10",
      "U18"
    ]
  },
  {
    "id": "input",
    "name": "5 V · main input",
    "type": "power",
    "info": "Main 5 V distribution; peripheral outputs pass through their switches.",
    "refs": [
      "J14",
      "U17",
      "U12",
      "U8",
      "U21",
      "U22",
      "J21"
    ]
  },
  {
    "id": "pmic-rails",
    "name": "PMIC · regulated rail bundle",
    "type": "power",
    "info": "Several distinct rails, including core, memory and I/O supplies. This bundle is not a single common net.",
    "refs": [
      "U17",
      "U1",
      "U2",
      "U3",
      "U7",
      "U16"
    ]
  },
  {
    "id": "3v3",
    "name": "3.3 V · board distribution",
    "type": "power",
    "info": "Main 3.3 V supply; switchable branches are simplified.",
    "refs": [
      "U12",
      "U17",
      "U5",
      "U9",
      "U6",
      "U13",
      "U18",
      "U20",
      "U11",
      "J21",
      "J7",
      "J18",
      "J1"
    ]
  },
  {
    "id": "enable",
    "name": "PMIC · 3.3 V enable",
    "type": "signal",
    "info": "PMIC enable output controls the 3.3 V regulator.",
    "refs": [
      "U17",
      "U12"
    ]
  },
  {
    "id": "1v0",
    "name": "1.0 V · SPE supply",
    "type": "power",
    "info": "Dedicated low-voltage supply for the DP83TD510E.",
    "refs": [
      "U16",
      "U13"
    ]
  },
  {
    "id": "usbpower",
    "name": "Switched 5 V · USB host",
    "type": "power",
    "info": "Switched USB-A VBUS.",
    "refs": [
      "U8",
      "J13"
    ]
  },
  {
    "id": "spepower",
    "name": "Switched 5 V · SPE PoDL",
    "type": "power",
    "info": "Separate power-over-data-line output branch.",
    "refs": [
      "U21",
      "J2"
    ]
  },
  {
    "id": "powerbutton",
    "name": "Power-button control",
    "type": "signal",
    "info": "Power-management input.",
    "refs": [
      "SW1",
      "U17"
    ]
  },
  {
    "id": "reset",
    "name": "System reset control",
    "type": "signal",
    "info": "Functional system reset path.",
    "refs": [
      "SW2",
      "U17",
      "U1"
    ]
  },
  {
    "id": "user",
    "name": "User / boot input",
    "type": "signal",
    "info": "User button input sampled for boot selection.",
    "refs": [
      "SW3",
      "U1"
    ]
  },
  {
    "id": "leds",
    "name": "User LED GPIO bundle",
    "type": "signal",
    "info": "Five independent GPIO-driven indicators, grouped.",
    "refs": [
      "U1",
      "LED2",
      "LED3",
      "LED4",
      "LED5",
      "LED6"
    ]
  },
  {
    "id": "status",
    "name": "Status indication bundle",
    "type": "signal",
    "info": "Separate power and link indication circuits, grouped.",
    "refs": [
      "U17",
      "U13",
      "U9",
      "LED1",
      "LED7",
      "LED8",
      "LED9",
      "LED10",
      "LED11"
    ]
  },
  {
    "id": "console",
    "name": "UART0 · serial console",
    "type": "signal",
    "info": "Logic-level serial RX and TX.",
    "refs": [
      "U1",
      "J6"
    ]
  },
  {
    "id": "bypass",
    "name": "Supply bypass support",
    "type": "power",
    "info": "Capacitors and regulator support grouped by function; no individual internal nodes are implied.",
    "refs": [
      "U17",
      "U12"
    ]
  },
  {
    "id": "gnd",
    "name": "GND · board reference",
    "type": "ground",
    "info": "Common reference through PCB ground planes. Connector shielding and signal-return detail is simplified.",
    "refs": [
      "U1",
      "U2",
      "U3",
      "J1",
      "U5",
      "U9",
      "U6",
      "U13",
      "J24",
      "J2",
      "J14",
      "J13",
      "J4",
      "U7",
      "J8",
      "J17",
      "J21",
      "J7",
      "J18",
      "U11",
      "U17",
      "U12",
      "U16",
      "U18",
      "U20",
      "U8",
      "U21",
      "U22",
      "SW1",
      "SW2",
      "SW3",
      "LED2",
      "LED3",
      "LED4",
      "LED5",
      "LED6",
      "LED1",
      "LED7",
      "LED8",
      "LED9",
      "LED10",
      "LED11",
      "J6",
      "J5",
      "J3",
      "J9",
      "J12"
    ]
  }
];
export function netsFor(ref){return connections.filter(n=>n.refs.includes(ref));}
