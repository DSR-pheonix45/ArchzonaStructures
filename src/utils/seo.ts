import { ViewRoute } from '../types';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { blogsData } from '../data/blogs';

export function updatePageSEO(route: ViewRoute) {
  let title = 'Archzona Structures | Digital Architectural Experience Centre';
  let description = 'Architectural materials, outdoor structures, tensile car parking shades, bioclimatic pergolas, and automated smart parking in Thane & Dombivli.';

  if (route.type === 'explore') {
    if (route.spaceSlug) {
      const sp = spacesData.find((s) => s.slug === route.spaceSlug);
      if (sp) {
        title = `${sp.name} Architectural Space | Archzona Structures`;
        description = `${sp.tagline} ${sp.description.slice(0, 150)}...`;
      }
    } else {
      title = 'Explore Architectural Spaces | Archzona Structures';
      description = 'Explore architectural environments calibrated for Poolside, Villas, Resorts, Smart Parking, Terraces, and Commercial spaces.';
    }
  } else if (route.type === 'materials') {
    if (route.materialSlug) {
      const mat = materialsData.find((m) => m.slug === route.materialSlug);
      if (mat) {
        title = `${mat.name} (${mat.category}) | Archzona Materials`;
        description = `${mat.positioning} ${mat.description.slice(0, 140)}...`;
      }
    } else {
      title = 'The Material Universe | WPC, HPL, ACP & Tensile Fabric | Archzona';
      description = 'Discover curated architectural materials: WPC decking, HPL rainscreens, ACP panels, Tensile fabric shade membranes, microcement, and acoustic panels.';
    }
  } else if (route.type === 'structures') {
    if (route.structureSlug) {
      const st = structuresData.find((s) => s.slug === route.structureSlug);
      if (st) {
        title = `${st.name} | Outdoor Architectural Structures | Archzona`;
        description = `${st.tagline} ${st.description.slice(0, 140)}...`;
      }
    } else {
      title = 'Outdoor Architectural Structures | Pergolas, Gazebos & Tensile Canopies';
      description = 'Custom engineered outdoor structures: Bioclimatic louvered pergolas, gazebos, tensile fabric canopies, and smart parking structures.';
    }
  } else if (route.type === 'blogs') {
    if (route.articleSlug) {
      const blog = blogsData.find((b) => b.slug === route.articleSlug);
      if (blog) {
        title = `${blog.title} | Archzona Insights`;
        description = blog.excerpt;
      }
    } else {
      title = 'Architectural Insights & Technical Blogs | Archzona Structures';
      description = 'Deep technical articles on Tensile Fabric Car Parking Shades, WPC vs HPL vs ACP Cladding, Bioclimatic Louvered Pergolas, and Smart Stack Parking.';
    }
  } else if (route.type === 'contact') {
    title = 'Contact Archzona Structures | Dombivli East, Thane | +91 98200 48805';
    description = 'Visit our Digital Architectural Experience Centre at 105, Prism Industrial Estate, Dombivli East, Thane. Call +91 98200 48805 or +91 97020 51858.';
  } else if (route.type === 'services') {
    title = 'Architectural Process & Turnkey Services | Archzona Structures';
    description = 'From spatial consultation to material engineering, custom steel fabrication, and turnkey installation across Mumbai, Thane, and Maharashtra.';
  } else if (route.type === 'shop') {
    title = 'Architectural Shop & Direct Procurement | Archzona Structures';
    description = 'Direct project ordering portal for WPC decking, HPL laminates, Onduline roofing, tensile membranes, and acoustic timber panels.';
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
