import { useRef, useEffect } from 'react';

export function useRenderCount(label: string = 'Render') {
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${label}: ${renderCount.current}`);
  });

  return renderCount.current;
}

// use case go to the componnent and use this and give the component name in it parameter
// const count = useRenderCount('NavActions');