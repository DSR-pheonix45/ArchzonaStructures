export interface ServiceItem {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'service-consult',
    step: '01',
    title: 'Consult',
    subtitle: 'Understand the spatial ambition and climatic constraints.',
    description: 'Every project begins with a forensic assessment of site conditions: sun path, wind exposure, proximity to saline coastal moisture, rainfall intensity, and human footfall patterns. We listen to your architectural intent to define performance boundaries before material selection.',
    deliverables: [
      'Climatic & environmental site exposure audit',
      'Structural load & substructure feasibility study',
      'Preliminary timeline and phased execution planning',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'service-curate',
    step: '02',
    title: 'Curate',
    subtitle: 'Select tactile materials with rigorous technical integrity.',
    description: 'We guide architects, landscape designers, and property owners through our tactile material library. We balance aesthetic grain, slip coefficients, fire classifications, thermal conductivities, and warranty lifespans to craft a harmonious palette tailored to your exact space.',
    deliverables: [
      'Physical curated material sample boards & tactile swatches',
      'Comparative lifecycle and maintenance cost projections',
      'Certified laboratory test reports (UV, fire, acoustics, slip)',
    ],
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'service-design',
    step: '03',
    title: 'Design',
    subtitle: 'Develop bespoke material integrations and structural details.',
    description: 'Our in-house architectural detailers produce precision 2D joinery drawings, 3D structural models, concealed fastening details, and parametric structural sizing. We ensure that materials interface cleanly without clumsy cover moldings or exposed screws.',
    deliverables: [
      'Architectural CAD shop drawings and junction details',
      '3D structural visualizations and joint simulations',
      'Structural engineer stamped calculations for wind and load',
    ],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'service-source',
    step: '04',
    title: 'Source',
    subtitle: 'Coordinate tier-one global and domestic material supplies.',
    description: 'Through our authorized partnerships with global category leaders including Onduline, Quick-Step, Unilin, NovaMix, and verified composite extruders, we guarantee genuine batch consistency, import logistics, and on-time site deliveries.',
    deliverables: [
      'Batch certification and factory-origin compliance docs',
      'Direct warehouse buffer inventory preventing site downtime',
      'Comprehensive product warranties backed by manufacturers',
    ],
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'service-fabricate',
    step: '05',
    title: 'Fabricate',
    subtitle: 'Precision off-site pre-assembly and bespoke manufacturing.',
    description: 'To minimize site disturbance and maintain micrometer tolerances, we pre-cut, CNC route, weld, and pre-assemble structural components in our controlled facility. Pylons, pergolas, and complex curved panels arrive numbered and ready for erection.',
    deliverables: [
      'CNC routed shadowlines and mortise-and-tenon joints',
      'Pre-tensioned membrane high-frequency welding',
      'Factory powder-coating and protective anti-corrosion priming',
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'service-install',
    step: '06',
    title: 'Install',
    subtitle: 'Master craftsman site execution with laser-levelled precision.',
    description: 'Our certified installation teams specialize exclusively in architectural systems: laser-levelled subfloor pedestal framing, concealed clip deck laying, tension membrane rigging, and seamless microcement trowelling. We don\'t leave until the last joint is immaculate.',
    deliverables: [
      'Dedicated on-site project engineer and safety supervision',
      'Sub-millimeter laser-levelled foundation and substructure',
      'Post-installation handover warranty & maintenance manual',
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
  },
];
