export interface Space {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  applications: string[];
  materials: string[];
  structures: string[];
  featuredProjects: string[];
}

export interface Application {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  spaces: string[];
  materials: string[];
  products: string[];
  structures: string[];
}

export type MaterialCategory = 
  | 'ROOFING' 
  | 'CLADDING' 
  | 'WOODEN DECK SYSTEM' 
  | 'BOARDS' 
  | 'SURFACES'
  | 'Roofing'
  | 'Cladding'
  | 'Wooden Deck System'
  | 'Boards'
  | 'Surfaces';

export interface Material {
  id: string;
  name: string;
  slug: string;
  category: MaterialCategory;
  positioning: string;
  description: string;
  heroImage: string;
  spaceImages: string[];
  materialImage: string;
  detailImage: string;
  whereItWorks: string[];
  whyItWorks: string[];
  tactility?: string;
  weathering?: string;
  technicalHighlights?: string[];
  characteristics: {
    label: string;
    value: string;
  }[];
  applications: string[];
  spaces: string[];
  structures: string[];
  collections: string[];
  products: string[];
}

export interface Collection {
  id: string;
  name: string;
  material: string;
  description: string;
  image: string;
  products: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  material: string;
  collection: string;
  description: string;
  applications: string[];
  spaces: string[];
  environment: 'Outdoor' | 'Indoor' | 'Semi-Outdoor' | 'All-Weather';
  finish: string;
  colour: string;
  dimensions: string;
  specifications: Record<string, string>;
  images: string[];
  documents: { title: string; type: string; size: string }[];
  availability: 'Ready Stock' | 'Custom Fabrication' | 'Project Order';
}

export interface Structure {
  id: string;
  name: string;
  slug: string;
  type: 'GAZEBO' | 'PERGOLA' | 'TENSILE STRUCTURES' | 'CUSTOM STRUCTURES';
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  applications: string[];
  spaces: string[];
  materials: string[];
  configuratorOptions: {
    sizes: string[];
    roofOptions: string[];
    materialOptions: string[];
    addons: string[];
  };
  configurations: {
    name: string;
    description: string;
    image: string;
    features: string[];
  }[];
}

export interface ProjectStory {
  id: string;
  title: string;
  slug: string;
  space: string;
  spaceName: string;
  location: string;
  clientType: string;
  description: string;
  heroImage: string;
  gallery: string[];
  application: string;
  material: string;
  structure: string;
  productsUsed: string[];
  highlights: string[];
}

export interface ProjectCartItem {
  productId: string;
  productName: string;
  material: string;
  brand: string;
  finish: string;
  image: string;
  quantity: number;
  areaSqFt: number;
  notes: string;
}

export interface ProjectCart {
  projectName: string;
  projectLocation: string;
  projectSize: string;
  requirements: string;
  notes: string;
  items: ProjectCartItem[];
}

export interface GazeboConfig {
  size: 'Small (3x3m)' | 'Medium (4x4m)' | 'Large (5x5m)' | 'Custom';
  roof: 'Solid' | 'Sloped' | 'Pitched' | 'Custom';
  structure: 'Timber' | 'Composite' | 'Metal' | 'Custom';
  floor: 'Wood' | 'WPC' | 'Terrazzo' | 'Other';
  seating: 'Built-in' | 'Loose' | 'None';
  lighting: 'Integrated' | 'None';
  finish: 'Natural' | 'Dark' | 'Painted' | 'Custom';
  notes: string;
}

export interface PergolaConfig {
  configuration: 'Freestanding' | 'Attached' | 'Open' | 'Slatted' | 'Partially covered' | 'Fully covered' | 'Walkway' | 'Poolside';
  material: 'WPC Composite' | 'Architectural Timber' | 'Powder-coated Aluminium' | 'Hybrid System';
  louvers: 'Motorized Bioclimatic' | 'Fixed Angle' | 'Sliding Slats' | 'Open Trellis';
  size: string;
  finish: 'Natural Teak' | 'Deep Charcoal' | 'Warm Stone' | 'Custom';
}

export interface QuoteRequest {
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  projectName: string;
  projectLocation: string;
  projectType: string;
  approximateArea: string;
  notes: string;
  items: ProjectCartItem[];
  customStructureConfig?: GazeboConfig | PergolaConfig;
  attachment?: File;
}

export interface ContactInquiry {
  name: string;
  company?: string;
  email: string;
  phone: string;
  projectType: string;
  projectLocation?: string;
  approximateSize?: string;
  requirements?: string;
  message?: string;
  attachment?: File;
}

export type ViewRoute = 
  | { type: 'home' }
  | { type: 'explore'; spaceSlug?: string }
  | { type: 'project-story'; projectSlug: string }
  | { type: 'materials'; category?: string; materialSlug?: string }
  | { type: 'structures'; structureSlug?: string }
  | { type: 'services' }
  | { type: 'blogs'; articleSlug?: string }
  | { type: 'shop'; productSlug?: string }
  | { type: 'contact' };
