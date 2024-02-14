import { h } from 'preact';

interface Animation2Props {
  width?: string;  // Width can be in px, em, %, etc.
  height?: string; // Height can be in px, em, %, etc.
}

const Animation2 = ({ width = "24", height = "24" }: Animation2Props) => (
<svg width="200" height="199" viewBox="0 0 200 199" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M16.7783 110.405L98.6669 62.7822L182.198 112.047L98.6669 159.997L16.7783 110.405Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
<path d="M65.0542 132.3L97.6782 151.239L129.974 132.3L97.6782 115.002L65.0542 132.3Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
<path d="M102.172 110.514L134.796 129.454L167.092 110.514L134.796 93.2168L102.172 110.514Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
<path d="M65.1631 87.9628L97.7871 106.902L130.083 87.9628L97.7871 70.6655L65.1631 87.9628Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
<path d="M27.7266 110.514L60.3506 129.454L92.6462 110.514L60.3506 93.2168L27.7266 110.514Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
</svg>
);

export default Animation2;
