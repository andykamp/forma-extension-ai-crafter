import { h } from 'preact';

interface Animation1Props {
  width?: string;  // Width can be in px, em, %, etc.
  height?: string; // Height can be in px, em, %, etc.
}

const Animation1 = ({ width = "24", height = "24" }: Animation1Props) => (
<svg width="199" height="199" viewBox="0 0 199 199" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M16.6123 110.405L98.5008 62.7822L182.032 112.047L98.5008 159.997L16.6123 110.405Z" fill="#D9D9D9" stroke="black" stroke-width="0.218953"/>
</svg>
);

export default Animation1;
