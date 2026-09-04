export interface Partner {
  name: string;
  category: string;
  description: string;
  country: string;
}

export const partnersData: Partner[] = [
  { name: 'Onduline', category: 'Roofing Systems', description: 'Global leader in composite cellulosic bitumen roofing', country: 'France' },
  { name: 'Quick-Step', category: 'Engineered Wood', description: 'Belgian master flooring and patented Uniclic® joinery', country: 'Belgium' },
  { name: 'Unilin', category: 'Panels & Flooring', description: 'High-performance architectural timber and acoustic technologies', country: 'Europe' },
  { name: 'NovaMix', category: 'Architectural Terrazzo', description: 'Premium marble aggregate terrazzo & mineral binders', country: 'Greece' },
  { name: 'Lamit', category: 'Roofing Systems', description: 'Architectural ceramic composite interlocking tiles', country: 'India' },
  { name: 'Voody', category: 'Composite Boards', description: 'High-density waterproof exterior structural boards', country: 'India' },
];
