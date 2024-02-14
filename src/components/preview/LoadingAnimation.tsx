import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import BuildingIcon from '../../icons/BuildingIcon';
import TerrainIcon from '../../icons/TerrainIcon';

const LoadingIndicator = () => {
  const [visibleSvg, setVisibleSvg] = useState({ svg1: false, svg2: false, svg3: false });

  useEffect(() => {
    const sequence = ['svg1', 'svg2', 'svg3', 'clear'];
    let currentStep = 0;

    const interval = setInterval(() => {
      const step = sequence[currentStep % sequence.length];
      setVisibleSvg(prevState => {
        return {
          svg1: step === 'svg1' || (step !== 'clear' && prevState.svg1),
          svg2: step === 'svg2' || (step !== 'clear' && prevState.svg2),
          svg3: step === 'svg3' || (step !== 'clear' && prevState.svg3)
        };
      });
      currentStep++;
    }, 1000); // Adjust time as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
      {visibleSvg.svg1 && <BuildingIcon />}
      {visibleSvg.svg2 && <TerrainIcon />}
      {visibleSvg.svg3 && <BuildingIcon />}
    </div>
  );
};

export default LoadingIndicator;

