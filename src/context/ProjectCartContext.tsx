import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProjectCart, ProjectCartItem, Product } from '../types';

interface ProjectCartContextType {
  cart: ProjectCart;
  addItem: (product: Product, quantity?: number, areaSqFt?: number, notes?: string) => void;
  updateItem: (productId: string, updates: Partial<Pick<ProjectCartItem, 'quantity' | 'areaSqFt' | 'notes'>>) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateProjectMeta: (updates: Partial<Pick<ProjectCart, 'projectName' | 'projectLocation' | 'projectSize' | 'requirements' | 'notes'>>) => void;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'archzona_project_cart_v1';

const defaultCartState: ProjectCart = {
  projectName: 'My Architectural Project',
  projectLocation: 'Mumbai / Alibaug',
  projectSize: 'Approx. 2,500 sq ft',
  requirements: 'Material supply & architectural structure detailing',
  notes: '',
  items: [
    // Pre-seeded with realistic project schedule example if clean
    {
      productId: 'prod-wpc-deck-teak',
      productName: 'Archzona WPC Co-Extruded Deck Board - Teak',
      material: 'wpc',
      brand: 'Archzona',
      finish: 'Deep Embossed Natural Teak Woodgrain',
      image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1200&auto=format&fit=crop',
      quantity: 120,
      areaSqFt: 550,
      notes: 'For main pool deck and sunken lounge plinth',
    },
    {
      productId: 'prod-wpc-louver-batten',
      productName: 'Archzona Co-Extruded Pergola & Louver Batten',
      material: 'wpc',
      brand: 'Archzona',
      finish: 'Four-sided 360° Textured Woodgrain',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
      quantity: 45,
      areaSqFt: 180,
      notes: 'Rafter louvers on custom cantilevered pergola framework',
    },
  ],
};

const ProjectCartContext = createContext<ProjectCartContextType | undefined>(undefined);

export const ProjectCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ProjectCart>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading project cart from storage:', e);
    }
    return defaultCartState;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving project cart to storage:', e);
    }
  }, [cart]);

  const addItem = (product: Product, quantity = 10, areaSqFt = 50, notes = '') => {
    setCart((prev) => {
      const existingIdx = prev.items.findIndex((i) => i.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...prev.items];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          areaSqFt: updated[existingIdx].areaSqFt + areaSqFt,
          notes: notes || updated[existingIdx].notes,
        };
        return { ...prev, items: updated };
      }

      const newItem: ProjectCartItem = {
        productId: product.id,
        productName: product.name,
        material: product.material,
        brand: product.brand,
        finish: product.finish,
        image: product.images[0] || '',
        quantity,
        areaSqFt,
        notes,
      };

      return {
        ...prev,
        items: [...prev.items, newItem],
      };
    });
    setIsCartOpen(true);
  };

  const updateItem = (productId: string, updates: Partial<Pick<ProjectCartItem, 'quantity' | 'areaSqFt' | 'notes'>>) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.productId === productId ? { ...item, ...updates } : item)),
    }));
  };

  const removeItem = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.productId !== productId),
    }));
  };

  const clearCart = () => {
    setCart((prev) => ({
      ...prev,
      items: [],
      notes: '',
    }));
  };

  const updateProjectMeta = (updates: Partial<Pick<ProjectCart, 'projectName' | 'projectLocation' | 'projectSize' | 'requirements' | 'notes'>>) => {
    setCart((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const totalItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ProjectCartContext.Provider
      value={{
        cart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        updateProjectMeta,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </ProjectCartContext.Provider>
  );
};

export function useProjectCart() {
  const context = useContext(ProjectCartContext);
  if (!context) {
    throw new Error('useProjectCart must be used within a ProjectCartProvider');
  }
  return context;
}
