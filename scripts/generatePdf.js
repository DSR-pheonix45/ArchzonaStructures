import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'mm',
  format: 'a4',
});

const pageWidth = 297;
const pageHeight = 210;

function addHeader(doc, pageNum, title) {
  doc.setFillColor(18, 20, 28);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, 10, pageHeight, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(title.toUpperCase(), 22, 22);

  doc.setDrawColor(209, 199, 183);
  doc.setLineWidth(0.3);
  doc.line(22, 26, 275, 26);

  doc.setTextColor(140, 130, 115);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`ARCHZONA PRODUCT CATALOGUE DECK  |  PAGE ${pageNum} OF 26`, 22, 202);
  doc.text(`CONTACT: +91 9870048082 | INFO.ARCHZONA@GMAIL.COM`, 185, 202);
}

// ----------------------------------------------------
// PAGE 1: TITLE / COVER
// ----------------------------------------------------
doc.setFillColor(18, 20, 28);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

doc.setFillColor(212, 175, 55);
doc.rect(0, 0, 15, pageHeight, 'F');

doc.setFillColor(26, 29, 40);
doc.roundedRect(30, 45, 237, 120, 4, 4, 'F');
doc.setDrawColor(212, 175, 55);
doc.setLineWidth(0.8);
doc.roundedRect(30, 45, 237, 120, 4, 4, 'D');

doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(38);
doc.text('ARCHZONA STRUCTURES', 45, 80);

doc.setTextColor(212, 175, 55);
doc.setFontSize(20);
doc.setFont('helvetica', 'normal');
doc.text('PRODUCT CATALOGUE DECK & SPECIFICATION MANUAL', 45, 96);

doc.setTextColor(209, 199, 183);
doc.setFontSize(11);
doc.text('Digital Experience Centre for Architectural Materials, Roofing Systems, Cladding & Outdoor Pavilions', 45, 112);

doc.setFillColor(212, 175, 55);
doc.rect(45, 122, 80, 0.8, 'F');

doc.setTextColor(140, 130, 115);
doc.setFontSize(10);
doc.text('Resort & Bungalow Development | Architectural Roofing | Composite Cladding | WPC & Terrazzo', 45, 140);
doc.text('Thane, Maharashtra, India | Phone: +91 9870048082 | Email: Info.archzona@gmail.com', 45, 148);

// ----------------------------------------------------
// PAGE 2: ABOUT US
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 2, 'ABOUT US');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(255, 255, 255);
doc.setFontSize(18);
doc.setFont('helvetica', 'bold');
doc.text('ARCHITECTURAL OBJECTS & SPATIAL CREATION', 35, 55);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.setTextColor(209, 199, 183);

const aboutText = `We specialize in Resort and Bungalow Development, with comprehensive services including Architectural Roofing Systems, High-Performance Cladding Materials, Wooden Deck Systems, and Custom Outdoor Structures.

We prioritize delivering high-quality workmanship, precision structural engineering, and excellent customer service across India and luxury retreat developments.`;

doc.text(doc.splitTextToSize(aboutText, 220), 35, 70);

const bullets = [
  '• Turnkey Resort & Villa Outdoor Living Environments',
  '• Sustainable Bitumen, Polycarbonate & Shingle Roofing',
  '• Weatherproof WPC, HPL, ACP & MgSO4 Cladding Panels',
  '• Pre-tensioned Double-Curved Tensile Fabric Canopies',
  '• High-Strength Cast-in-Place NovaMix Terrazzo Pathways',
];

let yPos = 115;
bullets.forEach((b) => {
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(b, 35, yPos);
  yPos += 10;
});

// ----------------------------------------------------
// PAGE 3: OUR SERVICES
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 3, 'OUR SERVICES');

const services = [
  {
    title: 'ROOFING SYSTEM',
    desc: 'Covering a building structure to protect against weather, provide thermal insulation, and ensure long-term waterproofing.',
    icon: '01',
  },
  {
    title: 'CLADDING MATERIAL',
    desc: 'Exterior or interior architectural layer to protect, enhance aesthetics, absorb acoustic reflection, and decorate structures.',
    icon: '02',
  },
  {
    title: 'WOODEN DECK SYSTEM',
    desc: 'Prefabricated products including wooden flooring, WPC facades, partition boards, and luxury poolside wall claddings.',
    icon: '03',
  },
  {
    title: 'GAZEBO & PERGOLAS',
    desc: 'Fibre Garden Gazebos and Louvered Pergolas providing roofed outdoor sanctuaries for shade, ventilation, and aesthetics.',
    icon: '04',
  },
];

services.forEach((s, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 22 + col * 130;
  const y = 35 + row * 75;

  doc.setFillColor(26, 29, 40);
  doc.roundedRect(x, y, 123, 68, 3, 3, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, 123, 68, 3, 3, 'D');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`[${s.icon}] ${s.title}`, x + 10, y + 18);

  doc.setTextColor(209, 199, 183);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(s.desc, 105), x + 10, y + 32);
});

// ----------------------------------------------------
// PAGE 4: ROOFING SYSTEM OVERVIEW
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 4, 'ROOFING SYSTEM OVERVIEW');

const roofOverview = [
  {
    title: 'ONDULINE ROOFING SYSTEM',
    desc: 'Eco-friendly Onduline roofing made from recycled materials provides lightweight, 100% waterproof and reliable protection against extreme weather conditions.',
  },
  {
    title: 'LAMIT ROOFING SYSTEM',
    desc: 'Lamit roofing is a durable, long-lasting system with precision tiles offering consistent weight, superior sound insulation, and a range of colours to match any architectural design.',
  },
  {
    title: 'TENSILE FABRIC SHADE',
    desc: 'Tensile fabric shade structures are durable and fully customizable, offering expansive clear-span shade and protection with stylish fabric membranes for any outdoor space.',
  },
];

roofOverview.forEach((r, idx) => {
  const y = 35 + idx * 48;
  doc.setFillColor(26, 29, 40);
  doc.roundedRect(22, y, 253, 42, 3, 3, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(r.title, 32, y + 15);

  doc.setTextColor(209, 199, 183);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(r.desc, 230), 32, y + 26);
});

// ----------------------------------------------------
// PAGE 5: ONDULINE ROOFING SYSTEM
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 5, 'ONDULINE® ROOFING SYSTEM');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 140, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.text('KEY FEATURES & BENEFITS', 32, 50);

const ondulineFeats = [
  '• Aesthetic & Architectural Appeal',
  '• 100% Waterproof Seal',
  '• High Wind Resistance (Up to 180 km/h)',
  '• Thermal-Comfort Insulation',
  '• Acoustic Comfort (Attenuates heavy rain noise)',
  '• Ultra Lightweight (3.1 kg/m²)',
];

let gy = 65;
ondulineFeats.forEach((f) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(f, 32, gy);
  gy += 12;
});

doc.setFillColor(212, 175, 55);
doc.roundedRect(170, 35, 105, 150, 3, 3, 'F');

doc.setTextColor(18, 20, 28);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('TECHNICAL SPECIFICATIONS', 180, 50);

const specs = [
  ['Length:', '1070 mm'],
  ['Width:', '400 mm'],
  ['Thickness:', '3 mm'],
  ['Weight:', '3.1 kg/m²'],
  ['Pigmented Colors:', 'Shaded Red, Brown, Green, Black'],
  ['Painted Colors:', 'Terracotta, Red, Green, Grey'],
];

let sy = 68;
specs.forEach(([label, val]) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(label, 180, sy);
  doc.setFont('helvetica', 'normal');
  doc.text(val, 222, sy);
  sy += 14;
});

// ----------------------------------------------------
// PAGE 6: ONDULINE CLASSIC
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 6, 'ONDULINE® CLASSIC');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('LIGHTWEIGHT COMPOSITE ROOFING SHEET', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('ONDULINE® CLASSIC is an internationally acclaimed lightweight corrugated composite roofing sheet engineered for residential, agricultural, and commercial buildings.', 35, 65);

const classicFeats = [
  '• Resistant to extreme weather conditions & thermal shock',
  '• Environmentally friendly, zero asbestos, and 100% recyclable',
  '• Easy to install and cut with standard hand tools',
  '• Provides superior noise dampening and thermal insulation',
  '• Long-lasting durability with 15-year waterproof guarantee',
];

let cy = 88;
classicFeats.forEach((cf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(cf, 35, cy);
  cy += 11;
});

doc.setFillColor(18, 20, 28);
doc.roundedRect(35, 148, 227, 26, 2, 2, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(9);
doc.setFont('helvetica', 'bold');
doc.text('LENGTH: 2000 mm   |   WIDTH: 950 mm   |   THICKNESS: 3 mm   |   WEIGHT: 3.4 kg/m²   |   COLORS: Red, Brown, Green, Black', 42, 164);

// ----------------------------------------------------
// PAGE 7: ONDULINE DURO 235
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 7, 'ONDULINE® DURO 235');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('HEAVY-DUTY BITUMEN & CELLULOSE FIBER ROOFING', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('ONDULINE® DURO 235 is a heavy-duty corrugated sheet reinforced with saturated bitumen and cellulosic fibers, specifically formulated for harsh environmental exposure.', 35, 65);

const duroFeats = [
  '• Excellent thermal and acoustic insulation performance',
  '• Non-corrosive, chemical resistant, and 100% rust-proof',
  '• Environmentally friendly and 100% recyclable organic composition',
  '• Easy to transport, handle, and fasten securely onto sub-frames',
  '• Available in a wide spectrum of UV-stable colors and sheet sizes',
];

let dy = 88;
duroFeats.forEach((df) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(df, 35, dy);
  dy += 11;
});

doc.setFillColor(18, 20, 28);
doc.roundedRect(35, 148, 227, 26, 2, 2, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(9);
doc.setFont('helvetica', 'bold');
doc.text('LENGTH: 2000 mm   |   WIDTH: 1055 mm   |   THICKNESS: 3 mm   |   WEIGHT: 3.3 kg/m²   |   COLORS: Red, Brown, Green, Black', 42, 164);

// ----------------------------------------------------
// PAGE 8: ONDUCLAIR
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 8, 'ONDUCLAIR® POLYCARBONATE');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('TRANSPARENT & TRANSLUCENT POLYCARBONATE ROOFING', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('ONDUCLAIR® is a high-performance transparent polycarbonate sheet providing high light transmission, daylighting for outdoor skylights, pergolas, and industrial structures.', 35, 65);

const onduclairFeats = [
  '• High impact resistance & shatterproof durability',
  '• Weather & broad temperature stability (-40°C to +130°C)',
  '• Integrated UV protective layer preventing yellowing and degradation',
  '• Provides thermal insulation while maximizing natural daylight',
  '• Easy to install with matching profile overlaps',
];

let oy = 88;
onduclairFeats.forEach((of) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(of, 35, oy);
  oy += 11;
});

doc.setFillColor(18, 20, 28);
doc.roundedRect(35, 148, 227, 26, 2, 2, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(9);
doc.setFont('helvetica', 'bold');
doc.text('LENGTH: 2000 mm   |   COVERAGE WIDTH: 950 mm   |   THICKNESS: 1.2 mm   |   TRANSMISSION: Up to 90% Light', 42, 164);

// ----------------------------------------------------
// PAGE 9: ROOFING ACCESSORIES
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 9, 'ROOFING ACCESSORIES');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 123, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.text('ONDUBAND* FLASHING TAPE', 32, 50);

doc.setTextColor(209, 199, 183);
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Self-adhesive butyl sealing tape engineered for waterproof ridge, valley, and wall flashing tie-ins.', 32, 62);

const ondubandSpecs = [
  '• Aluminum Thickness: 10 mm',
  '• Butyl Glue Width: 0.10 / 0.15 / 0.20 / 0.30 mm',
  '• Total Thickness: 1.5 mm',
  '• Roll Width: 38 mm',
  '• Prevents leaks & structural water ingress',
];

let obY = 82;
ondubandSpecs.forEach((s) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.text(s, 32, obY);
  obY += 10;
});

doc.setFillColor(26, 29, 40);
doc.roundedRect(152, 35, 123, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.text('ONDULAIR® SLIM VENTILATION', 162, 50);

doc.setTextColor(209, 199, 183);
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Breathable ridge ventilation band promoting airflow while stopping moisture and pest penetration.', 162, 62);

const ondulairSlimSpecs = [
  '• Band Width: 150 mm',
  '• Membrane Thickness: 140 μ',
  '• Weight: 3.1 kg/m²',
  '• Enhances thermal comfort & roof lifespan',
  '• Compatible with all corrugated profiles',
];

let osY = 82;
ondulairSlimSpecs.forEach((s) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.text(s, 162, osY);
  osY += 10;
});

// ----------------------------------------------------
// PAGE 10: LAMIT ROOFING SYSTEM
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 10, 'LAMIT ROOFING SYSTEM');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('LAMINATED FIBERGLASS & ASPHALT SHINGLE ROOFING', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('LAMIT ROOFING SYSTEM uses multi-layer laminated shingles with a heavy-duty fiberglass base and PU-based glass pigmentation coating, delivering premium weather protection.', 35, 64);

const lamitSpecs = [
  '• 10 Years Comprehensive Warranty',
  '• UV & Moisture Resistance',
  '• 3-Layer Protective Coating System',
  '• PU Based Glass Pigmentation Coating',
  '• Fungal & Algae Resistance Treatment',
  '• 100% Natural Organic Look & Sound Insulation',
];

let ly = 85;
lamitSpecs.forEach((ls) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(ls, 35, ly);
  ly += 11;
});

// ----------------------------------------------------
// PAGE 11: TENSILE FABRIC SHADE
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 11, 'TENSILE FABRIC SHADE');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('PRE-TENSIONED DOUBLE-CURVED MEMBRANE STRUCTURES', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('A Tensile Fabric Shade is a lightweight architectural shade structure made of flexible, tensioned PVDF or PTFE fabric membranes supported by engineered structural steel frames.', 35, 65);

const tensileUses = [
  '• Provides wide clear-span shade for patios, decks, car parking & playgrounds',
  '• Dramatically enhances the aesthetic signature of resort & commercial spaces',
  '• Offers 99% protection from UV rays and heavy monsoon rainfall',
  '• Can be custom engineered into hypar, conical, or wave geometries',
  '• Requires minimal maintenance with long 15+ year operational lifespan',
];

let ty = 88;
tensileUses.forEach((tu) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(tu, 35, ty);
  ty += 11;
});

// ----------------------------------------------------
// PAGE 12: CLADDING MATERIAL OVERVIEW
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 12, 'CLADDING MATERIAL OVERVIEW');

const claddingTypes = [
  {
    title: 'WPC (WOOD PLASTIC COMPOSITE)',
    desc: 'High-density composite material made of natural wood fiber and recycled polymers for authentic timber aesthetics with zero maintenance.',
  },
  {
    title: 'HPL (HIGH PRESSURE LAMINATE)',
    desc: 'Decorative high-strength exterior laminate with resin-impregnated paper core, delivering scratch, graffiti, and fire-resistant facades.',
  },
  {
    title: 'ACP (ALUMINIUM COMPOSITE PANEL)',
    desc: 'Flat panel composed of two thin aluminum sheets bonded to a polyethylene or fire-retardant mineral core for modern commercial facades.',
  },
];

claddingTypes.forEach((c, idx) => {
  const y = 35 + idx * 48;
  doc.setFillColor(26, 29, 40);
  doc.roundedRect(22, y, 253, 42, 3, 3, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(c.title, 32, y + 15);

  doc.setTextColor(209, 199, 183);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(c.desc, 230), 32, y + 26);
});

// ----------------------------------------------------
// PAGE 13: WPC CLADDING & DECKING
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 13, 'WPC CLADDING & DECKING');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('WOOD PLASTIC COMPOSITE (WPC)', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('WPC combines natural wood fibers with advanced polymers to create high-durability planks that offer the authentic look of timber without the vulnerabilities of natural wood.', 35, 64);

const wpcFeats = [
  '• 100% Water & Moisture Proof: Engineered matrix prevents water absorption, swelling or rot',
  '• UV & Weather Resistant: Withstands prolonged sun exposure and monsoon rains without fading',
  '• Anti-Slip Grooved Texture: Precision-profiled surface offers superior grip underfoot',
  '• Zero Maintenance: Eliminates the need for periodic polishing, oiling, or chemical sealing',
  '• Termite & Borer Proof: High-density polymer blend completely resists insects and decay',
];

let wy = 85;
wpcFeats.forEach((wf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(wf, 35, wy);
  wy += 11;
});

// ----------------------------------------------------
// PAGE 14: HPL ARCHITECTURAL CLADDING
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 14, 'HPL ARCHITECTURAL CLADDING');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('HIGH PRESSURE LAMINATE (HPL)', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('HPL is produced by fusing multiple layers of kraft paper with thermosetting resins under extreme heat and pressure for high-impact architectural facades.', 35, 64);

const hplFeats = [
  '• Superior Impact & Scratch Resistance: Dense core resists mechanical wear and impacts',
  '• Weather & UV Stability: Specially coated surface protects against heavy rainfall and fading',
  '• Fire Retardant Properties: Self-extinguishing characteristics meet safety codes',
  '• Moisture & Graffiti Proof: Non-porous surface allows effortless removal of paint & stains',
  '• Easy Installation: Compatible with rear-ventilated facade systems, rivets or adhesives',
];

let hy = 85;
hplFeats.forEach((hf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(hf, 35, hy);
  hy += 11;
});

// ----------------------------------------------------
// PAGE 15: ACP CLADDING PANELS
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 15, 'ACP CLADDING PANELS');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('ALUMINIUM COMPOSITE PANEL (ACP)', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('ACP is composed of two thin aluminum sheets bonded to a mineral or polyethylene core, renowned for lightweight versatility, flatness, and sleek aesthetic.', 35, 64);

const acpFeats = [
  '• Lightweight Yet Rigid: High strength-to-weight ratio ensures superior flatness',
  '• Extreme Weather & UV Resistance: PVDF fluorocarbon coatings prevent chalking and fading',
  '• Easy Fabrication & Flexibility: Effortlessly cut, grooved, bent and folded into curves',
  '• Fire Performance Available: Mineral-filled core grades offer high flame retardancy',
  '• Smooth & Modern Aesthetic: Uniform non-porous finish in metallic, solid, and textured styles',
];

let ay = 85;
acpFeats.forEach((af) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(af, 35, ay);
  ay += 11;
});

// ----------------------------------------------------
// PAGE 16: VOODY PROBOARD
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 16, 'VOODY PROBOARD (MgSO4)');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('MAGNESIUM SULPHATE (MgSO4) PROBOARD', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Voody MgSO4 Proboard is a zero-chloride, non-corrosive building board reinforced with multi-layer fiberglass mesh for extreme fire protection and moisture immunity.', 35, 64);

const voodyFeats = [
  '• Non-Combustible (Class A1 Fire Rating): Withstands extreme temperatures without toxic fumes',
  '• 100% Chloride-Free & Non-Corrosive: Eliminates crying board sweating and screw corrosion',
  '• Superior Water & Mould Resistance: Retains dimensional stability when submerged',
  '• High Impact & Bending Strength: Heavy-duty fiberglass mesh delivers high load bearing',
  '• Eco-Friendly & Non-Toxic: 100% free from asbestos, silica dust, and formaldehyde',
];

let vy = 85;
voodyFeats.forEach((vf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(vf, 35, vy);
  vy += 11;
});

// ----------------------------------------------------
// PAGE 17: SWIMMING POOL DECK AREA
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 17, 'SWIMMING POOL DECK AREA');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('POOL SURROUNDS WITH WPC COMPOSITE DECKING', 35, 55);

doc.setTextColor(209, 199, 183);
doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const poolText = `Transform your backyard or resort property into an exquisite oasis with the installation of a beautiful swimming pool deck using Archzona WPC decking.

The ultimate space for Relaxation, Exercise, and Entertaining. Your new pool surround stays cool under barefoot tropical sun, provides non-slip safety when wet, and resists pool chemicals effortlessly.`;

doc.text(doc.splitTextToSize(poolText, 220), 35, 70);

// ----------------------------------------------------
// PAGE 18: WOODEN DECK SYSTEM OVERVIEW
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 18, 'WOODEN DECK SYSTEM');

const deckCats = [
  {
    title: 'FLOORS',
    desc: 'High-traffic walkable surfaces engineered for continuous load-bearing durability, water resistance, and natural timber elegance.',
  },
  {
    title: 'WALLS',
    desc: 'Vertical structural enclosures designed to provide acoustic control, thermal insulation, and architectural timber cladding.',
  },
  {
    title: 'PARTITIONS',
    desc: 'Lightweight non-load-bearing vertical dividers used to delineate interior zones flexibly while allowing ambient light pass-through.',
  },
];

deckCats.forEach((dc, idx) => {
  const y = 35 + idx * 48;
  doc.setFillColor(26, 29, 40);
  doc.roundedRect(22, y, 253, 42, 3, 3, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(dc.title, 32, y + 15);

  doc.setTextColor(209, 199, 183);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(dc.desc, 230), 32, y + 26);
});

// ----------------------------------------------------
// PAGE 19: FLOORS
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 19, 'WOODEN & ENGINEERED FLOORS');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('WOODEN, ENGINEERED & LVT/SPC FLOORING', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Combines the natural warmth of real timber with advanced multi-layer stability, referencing Quick-Step and Voody Floors specifications.', 35, 64);

const floorFeats = [
  '• Authentic Timber Aesthetic: Genuine oak veneers or ultra-realistic HD grain embossing',
  '• 100% Water & Moisture Proof (LVT/SPC): Hydroseal joint sealing and rigid stone-polymer core',
  '• High Wear & Scratch Resistance: AC4/AC5 commercial rating against heavy foot traffic',
  '• Seamless Click Installation: Advanced glue-free interlocking systems (Uniclic/Unizip)',
  '• Acoustic Comfort & Underfloor Heating: Integrated sound dampening underlayment',
];

let fly = 85;
floorFeats.forEach((ff) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(ff, 35, fly);
  fly += 11;
});

// ----------------------------------------------------
// PAGE 20: WALLS
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 20, 'ACOUSTIC WOODEN WALL PANELS');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('ACOUSTIC WOODEN WALL PANELS & CLADDINGS', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Combines natural timber visuals with engineered acoustic absorption felt backing to reduce reverberation and echo.', 35, 64);

const wallFeats = [
  '• Superior Acoustic Performance: Slatted timber design paired with recycled acoustic felt',
  '• Natural Wood Aesthetic: Genuine wood veneers offer rich grain textures and tactile warmth',
  '• Surface Protection & Durability: Shields underlying walls from scuffs and impact damage',
  '• Quick Modular Installation: Interlocking tongue-and-groove or batten mounting systems',
  '• Moisture & Termite Resistant: Specialized treatments prevent warping and pest damage',
];

let waly = 85;
wallFeats.forEach((wf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(wf, 35, waly);
  waly += 11;
});

// ----------------------------------------------------
// PAGE 21: PARTITIONS
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 21, 'ARCHITECTURAL TIMBER PARTITIONS');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('WOODEN-BASED PARTITION & DIVIDER SYSTEMS', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Provides functional spatial segregation while preserving visual continuity, natural light flow, and acoustic privacy.', 35, 64);

const partFeats = [
  '• Flexible Spatial Zoning: Creates distinct functional zones without permanent masonry walls',
  '• Acoustic & Visual Privacy: Diffuses sound transmission while permitting continuous ventilation',
  '• Light Transmission: Vertical and horizontal batten designs filter daylight into adjoining rooms',
  '• Structural Stability & Durability: Engineered solid timber and composite core stability',
  '• Modular & Demountable: Fast dry installation adaptable to changing floor plans',
];

let py = 85;
partFeats.forEach((pf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(pf, 35, py);
  py += 11;
});

// ----------------------------------------------------
// PAGE 22: OUTDOOR STRUCTURES OVERVIEW
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 22, 'OUTDOOR STRUCTURES OVERVIEW');

const structOverview = [
  {
    title: 'GAZEBO PAVILIONS',
    desc: 'Freestanding open-sided architectural pavilions with solid, full-coverage pitched or flat insulated roofs for shade and shelter.',
  },
  {
    title: 'PERGOLA SYSTEMS',
    desc: 'Outdoor architectural frameworks with vertical posts and horizontal cross-beams supporting open or bioclimatic louvered roof slats.',
  },
  {
    title: 'MICRO CEMENT & TERRAZZO',
    desc: 'Sleek, modern concrete and aggregate finish structures with seamless, waterproof, non-slip surfaces for walkways and sunken lounges.',
  },
];

structOverview.forEach((so, idx) => {
  const y = 35 + idx * 48;
  doc.setFillColor(26, 29, 40);
  doc.roundedRect(22, y, 253, 42, 3, 3, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(so.title, 32, y + 15);

  doc.setTextColor(209, 199, 183);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(so.desc, 230), 32, y + 26);
});

// ----------------------------------------------------
// PAGE 23: FIBRE GARDEN GAZEBO
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 23, 'FIBRE GARDEN GAZEBO');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('FIBER REINFORCED GARDEN GAZEBO', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('The Fibre Garden Gazebo is a roofed outdoor structure made of fiber-reinforced composite materials, featuring integrated seating areas and heavy-weather protection.', 35, 64);

const gazeboFeats = [
  '• Exceptional strength & structural durability',
  '• Resilient against tropical monsoon rain and extreme UV radiation',
  '• Minimal maintenance required; zero corrosion or rot',
  '• Creates a comfortable, shaded outdoor lounge seating zone',
  '• Fully customizable in dimensions, colors, and roof finishes',
];

let gzy = 85;
gazeboFeats.forEach((gf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(gf, 35, gzy);
  gzy += 11;
});

// ----------------------------------------------------
// PAGE 24: PERGOLA PATIO
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 24, 'PERGOLA PATIO & PROFILES');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('ARCHITECTURAL PERGOLA SYSTEMS & PROFILE MATRIX', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('A pergola forms a shaded walkway, passageway, or seating area with vertical posts supporting open or louvered cross-beams.', 35, 64);

const pergolaProfiles = [
  '• SN150W150 Heavy Column Post (150 x 150 mm)',
  '• SN160W80 Structural Main Beam (160 x 80 mm)',
  '• SN146W50 Rafter Fin (146 x 50 mm)',
  '• SN90W90 Secondary Column (90 x 90 mm)',
  '• SN120W120 Mid-Span Column (120 x 120 mm)',
];

let pgy = 85;
pergolaProfiles.forEach((pp) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(pp, 35, pgy);
  pgy += 11;
});

// ----------------------------------------------------
// PAGE 25: NOVAMIX TERRAZZO
// ----------------------------------------------------
doc.addPage();
addHeader(doc, 25, 'NOVAMIX TERRAZZO SYSTEM');

doc.setFillColor(26, 29, 40);
doc.roundedRect(22, 35, 253, 150, 3, 3, 'F');

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('HIGH-PERFORMANCE ARCHITECTURAL TERRAZZO', 35, 52);

doc.setTextColor(209, 199, 183);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('NovaMix Terrazzo blends high-strength hydraulic binders with natural marble, quartz, or recycled glass aggregates into seamless in-situ or precast slabs.', 35, 64);

const terrazzoFeats = [
  '• Exceptional Compressive Strength: 50-60+ MPa for heavy pedestrian traffic',
  '• Ultra-Low Thickness System: Full strength at just 6-20 mm, drastically reducing dead load',
  '• Weather & Water Resilient: UV-stable, non-porous, and resistant to pool chemicals',
  '• Seamless & Monolithic: Molds continuously over flat, curved or angular substrates',
  '• Used in: Urban walkways, poolside surrounds, hotel lobbies, planters & outdoor benches',
];

let tzy = 85;
terrazzoFeats.forEach((tf) => {
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(tf, 35, tzy);
  tzy += 11;
});

// ----------------------------------------------------
// PAGE 26: CONTACT US
// ----------------------------------------------------
doc.addPage();
doc.setFillColor(18, 20, 28);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

doc.setFillColor(212, 175, 55);
doc.rect(0, 0, 15, pageHeight, 'F');

doc.setFillColor(26, 29, 40);
doc.roundedRect(30, 35, 237, 140, 4, 4, 'F');
doc.setDrawColor(212, 175, 55);
doc.setLineWidth(0.8);
doc.roundedRect(30, 35, 237, 140, 4, 4, 'D');

doc.setTextColor(255, 255, 255);
doc.setFontSize(32);
doc.setFont('helvetica', 'bold');
doc.text('CONTACT ARCHZONA STRUCTURES', 45, 60);

doc.setTextColor(212, 175, 55);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('HEADQUARTERS & EXPERIENCE CENTRE', 45, 75);

doc.setTextColor(209, 199, 183);
doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.text('1/19 Ganesh Apt, C.D. Rd, Ram Nagar, Dombivli (E), Thane, Maharashtra, India', 45, 90);
doc.text('Phone: +91 9870048082', 45, 102);
doc.text('Email: Info.archzona@gmail.com', 45, 114);

doc.setFillColor(212, 175, 55);
doc.rect(45, 126, 120, 0.8, 'F');

doc.setTextColor(140, 130, 115);
doc.setFontSize(10);
doc.text('Turnkey Execution | Custom CAD Drawings | Material Samples & Swatches', 45, 142);
doc.text('Visit www.archzonastructures.com for interactive configurators & digital catalog', 45, 152);

// Output PDF to public/
const outputDir = path.resolve('public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pdfPath = path.join(outputDir, 'Archzona_Product_Catalogue_Deck.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(pdfPath, Buffer.from(pdfBytes));

console.log(`PDF successfully generated at: ${pdfPath}`);
