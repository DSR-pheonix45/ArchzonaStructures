import { ViewRoute } from '../types';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { blogsData } from '../data/blogs';

export function updatePageSEO(route: ViewRoute) {
  let title = 'Archzone Structures by ARCHZONA | Digital Architectural Experience Centre';
  let description = 'Architectural materials, outdoor structures, tensile car parking shades, bioclimatic pergolas, and automated smart parking in Thane & Dombivli by ARCHZONA.';

  if (route.type === 'explore') {
    if (route.spaceSlug) {
      const sp = spacesData.find((s) => s.slug === route.spaceSlug);
      if (sp) {
        title = `${sp.name} Architectural Space | Archzone Structures by ARCHZONA`;
        description = `${sp.tagline} ${sp.description.slice(0, 150)}...`;
      }
    } else {
      title = 'Explore Architectural Spaces | Archzone Structures by ARCHZONA';
      description = 'Explore architectural environments calibrated for Poolside, Villas, Resorts, Smart Parking, Terraces, and Commercial spaces by ARCHZONA.';
    }
  } else if (route.type === 'materials') {
    if (route.materialSlug) {
      const mat = materialsData.find((m) => m.slug === route.materialSlug);
      if (mat) {
        title = `${mat.name} (${mat.category}) | Archzone Materials by ARCHZONA`;
        description = `${mat.positioning} ${mat.description.slice(0, 140)}...`;
      }
    } else {
      title = 'The Material Universe | WPC, HPL, ACP & Tensile Fabric | Archzone Structures by ARCHZONA';
      description = 'Discover curated architectural materials: WPC decking, HPL rainscreens, ACP panels, Tensile fabric shade membranes, microcement, and acoustic panels by ARCHZONA.';
    }
  } else if (route.type === 'structures') {
    if (route.structureSlug) {
      const st = structuresData.find((s) => s.slug === route.structureSlug);
      if (st) {
        title = `${st.name} | Outdoor Architectural Structures | Archzone Structures by ARCHZONA`;
        description = `${st.tagline} ${st.description.slice(0, 140)}...`;
      }
    } else {
      title = 'Outdoor Architectural Structures | Pergolas, Gazebos & Tensile Canopies | Archzone Structures by ARCHZONA';
      description = 'Custom engineered outdoor structures: Bioclimatic louvered pergolas, gazebos, tensile fabric canopies, and smart parking structures by ARCHZONA.';
    }
  } else if (route.type === 'blogs') {
    if (route.articleSlug) {
      const blog = blogsData.find((b) => b.slug === route.articleSlug);
      if (blog) {
        title = `${blog.title} | Archzone Insights by ARCHZONA`;
        description = blog.excerpt;
      }
    } else {
      title = 'Architectural Insights & Technical Blogs | Archzone Structures by ARCHZONA';
      description = 'Deep technical articles on Tensile Fabric Car Parking Shades, WPC vs HPL vs ACP Cladding, Bioclimatic Louvered Pergolas, and Smart Stack Parking by ARCHZONA.';
    }
  } else if (route.type === 'contact') {
    title = 'Contact ARCHZONA | 105, PRISM INDUSTRIAL ESTATE, DOMBIVLI (EAST) 421201 | +91 97020 51858';
    description = 'Visit ARCHZONA at 105, PRISM INDUSTRIAL ESTATE, BEHIND PENDARKAR COLLEGE, DOMBIVLI (EAST) 421201. Call +91 97020 51858 or email info.archzona@gmail.com. GSTIN: 27ACDFA4175F1ZJ.';
  } else if (route.type === 'services') {
    title = 'Architectural Process & Turnkey Services | Archzone Structures by ARCHZONA';
    description = 'From spatial consultation to material engineering, custom steel fabrication, and turnkey installation across Mumbai, Thane, and Maharashtra by ARCHZONA.';
  } else if (route.type === 'shop') {
    title = 'Architectural Shop & Direct Procurement | Archzone Structures by ARCHZONA';
    description = 'Direct project ordering portal for WPC decking, HPL laminates, Onduline roofing, tensile membranes, and acoustic timber panels by ARCHZONA.';
  }

  document.title = title;

  // Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }

  // Update OpenGraph Title & Description
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', description);
  }
}
