import { h } from 'preact';

interface CloseIconProps {
  width?: string;  // Width can be in px, em, %, etc.
  height?: string; // Height can be in px, em, %, etc.
}

const CloseIcon = ({ width = "24", height = "24" }: CloseIconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.2929 7.99999L3.39645 4.10355L4.10356 3.39644L8.00001 7.29288L11.8965 3.39644L12.6036 4.10355L8.70711 7.99999L12.6036 11.8964L11.8965 12.6035L8.00001 8.7071L4.10356 12.6035L3.39645 11.8964L7.2929 7.99999Z" fill="currentColor"></path>
  </svg>
);

export default CloseIcon;
