import { useState, useEffect } from 'react';

export function useDynamicStyles(layoutName: string) {
  const [styles, setStyles] = useState<any>({});

  useEffect(() => {
    const loadStyles = async () => {
      try {
        const styleModule = await import(`../layouts/${layoutName}/styles/`);
        setStyles(styleModule.default);
      } catch (error) {
        console.error(`Could not load styles for layout: ${layoutName}`, error);
        setStyles({}); // Fallback to empty styles
      }
    };

    loadStyles();
  }, [layoutName]);

  return styles;
}