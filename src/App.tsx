import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ProjectCartProvider } from './context/ProjectCartContext';
import { ViewRoute, Product } from './types';
import { productsData } from './data/products';

// Global Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProjectCartDrawer } from './components/ProjectCartDrawer';
import { QuoteModal } from './components/QuoteModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Views
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { MaterialsView } from './views/MaterialsView';
import { StructuresView } from './views/StructuresView';
import { ShopView } from './views/ShopView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { ProjectStoryView } from './views/ProjectStoryView';
import { BlogsView } from './views/BlogsView';

import { updatePageSEO } from './utils/seo';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>({ type: 'home' });
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeStructureConfig, setActiveStructureConfig] = useState<any | null>(null);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  // Scroll to top and update dynamic SEO meta tags on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageSEO(currentRoute);
  }, [currentRoute]);

  const handleNavigate = (route: ViewRoute) => {
    setCurrentRoute(route);
  };

  const handleOpenProduct = (productSlug: string) => {
    const found = productsData.find((p) => p.slug === productSlug || p.id === productSlug);
    if (found) {
      setActiveProduct(found);
    }
  };

  const handleDiscussProduct = (product: Product) => {
    setContactSubject(`${product.name} (${product.brand})`);
    setCurrentRoute({ type: 'contact' });
  };

  const handleRequestConsultation = (materialName?: string) => {
    setContactSubject(materialName ? `Material sample / consultation for ${materialName}` : 'Turnkey site consultation');
    setCurrentRoute({ type: 'contact' });
  };

  const handleStructureQuote = (config: any) => {
    setActiveStructureConfig(config);
    setIsQuoteOpen(true);
  };

  const handleOpenGeneralQuote = () => {
    setActiveStructureConfig(null);
    setIsQuoteOpen(true);
  };

  return (
    <ProjectCartProvider>
      <div id="archzona-app-root" className="relative min-h-screen bg-[#0D0C0A] text-[#F7F5F0] font-sans-clean selection:bg-[#D1C7B7] selection:text-[#0D0C0A] flex flex-col overflow-x-hidden">
        {/* Subtle Architectural Grain Background */}
        <div className="fixed inset-0 architectural-grain pointer-events-none z-0" aria-hidden="true" />

        {/* Fixed Navigation Header */}
        <div className="relative z-40">
          <Navbar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        {/* Main Routed Content Area */}
        <main className="flex-1 relative z-10">
          {currentRoute.type === 'home' && (
            <HomeView onNavigate={handleNavigate} />
          )}

          {currentRoute.type === 'explore' && (
            <ExploreView
              initialSpaceSlug={currentRoute.spaceSlug}
              onNavigate={handleNavigate}
              onOpenProduct={handleOpenProduct}
            />
          )}

          {currentRoute.type === 'materials' && (
            <MaterialsView
              initialMaterialSlug={currentRoute.materialSlug}
              onNavigate={handleNavigate}
              onOpenProduct={handleOpenProduct}
              onRequestConsultation={handleRequestConsultation}
            />
          )}

          {currentRoute.type === 'structures' && (
            <StructuresView
              initialStructureSlug={currentRoute.structureSlug}
              onNavigate={handleNavigate}
              onRequestStructureQuote={handleStructureQuote}
            />
          )}

          {currentRoute.type === 'shop' && (
            <ShopView
              onOpenProduct={handleOpenProduct}
              onNavigate={handleNavigate}
              onRequestQuote={handleOpenGeneralQuote}
            />
          )}

          {currentRoute.type === 'services' && (
            <ServicesView
              onNavigate={handleNavigate}
              onRequestConsultation={() => handleRequestConsultation()}
            />
          )}

          {currentRoute.type === 'about' && (
            <AboutView onNavigate={handleNavigate} />
          )}

          {currentRoute.type === 'contact' && (
            <ContactView initialSubject={contactSubject} />
          )}

          {currentRoute.type === 'project-story' && (
            <ProjectStoryView
              projectSlug={currentRoute.projectSlug}
              onNavigate={handleNavigate}
              onOpenProduct={handleOpenProduct}
            />
          )}

          {currentRoute.type === 'blogs' && (
            <BlogsView
              initialArticleSlug={currentRoute.articleSlug}
              onNavigate={handleNavigate}
              onOpenQuote={handleOpenGeneralQuote}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Global Modals & Drawers */}
        <ProjectCartDrawer onRequestQuote={handleOpenGeneralQuote} />

        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={() => {
            setIsQuoteOpen(false);
            setActiveStructureConfig(null);
          }}
          customStructureConfig={activeStructureConfig}
        />

        <ProductDetailModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onNavigate={handleNavigate}
          onDiscussProduct={handleDiscussProduct}
        />

        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
          onOpenProduct={handleOpenProduct}
        />

        <Analytics />
      </div>
    </ProjectCartProvider>
  );
}
