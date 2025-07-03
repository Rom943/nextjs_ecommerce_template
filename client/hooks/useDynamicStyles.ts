import { useState, useEffect } from 'react';

export function useDynamicStyles(layoutName: string ,pageName: string) {
  const [styles, setStyles] = useState<any>({});

  useEffect(() => {
    const loadStyles = async () => {
      try {
        const styleModule = await import(`../layouts/${layoutName}/styles/${pageName}.module.css`);
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

