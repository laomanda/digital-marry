import { useState, useEffect } from 'react';

export type PaletteKey = 'black' | 'burgundy' | 'taupe';

const PALETTE_STORAGE_KEY = 'navbar_palette';

function getStoredPalette(): PaletteKey {
  if (typeof window === 'undefined') return 'black';

  try {
    const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    if (storedPalette === 'black' || storedPalette === 'burgundy' || storedPalette === 'taupe') {
      return storedPalette as PaletteKey;
    }
    return 'black';
  } catch {
    return 'black';
  }
}

export function usePalette() {
  const [palette, setPalette] = useState<PaletteKey>(getStoredPalette);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PALETTE_STORAGE_KEY && e.newValue) {
        if (e.newValue === 'black' || e.newValue === 'burgundy' || e.newValue === 'taupe') {
          setPalette(e.newValue as PaletteKey);
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<PaletteKey>;
      if (customEvent.detail) {
        setPalette(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('navbar-palette-change', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('navbar-palette-change', handleCustomChange);
    };
  }, []);

  return {
    palette,
    isBurgundy: palette === 'burgundy',
    isTaupe: palette === 'taupe',
  };
}
