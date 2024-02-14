
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import BuildingIcon from '../../icons/BuildingIcon';
import TerrainIcon from '../../icons/TerrainIcon';
import Animation1 from '../../icons/Animation1';
import Animation2 from '../../icons/Animation2';
import Animation3 from '../../icons/Animation3';
import Animation4 from '../../icons/Animation4';

const LoadingIndicator = () => {
  const [currentSvg, setCurrentSvg] = useState(0);

  useEffect(() => {
    const sequence = [1, 2, 3, 4, 0]; // 0 indicates clear
    let index = 0;

    const interval = setInterval(() => {
      setCurrentSvg(sequence[index]);
      index = (index + 1) % sequence.length;
    }, 1000); // Change the SVG every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
      {currentSvg === 1 && (
        <div style={{ position: 'absolute' }}>
          <Animation1 />
        </div>
      )}
      {currentSvg === 2 && (
        <div style={{ position: 'absolute' }}>
          <Animation2 />
        </div>
      )}
      {currentSvg === 3 && (
        <div style={{ position: 'absolute' }}>
          <Animation3 />
        </div>
      )}
      {currentSvg === 4 && (
        <div style={{ position: 'absolute' }}>
          <Animation4 />
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;
