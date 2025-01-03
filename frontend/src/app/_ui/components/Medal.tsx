import React from 'react';

interface MedalProps {
  type?: string | null;
  style?: React.CSSProperties;
  height?: string;
  width?: string;
}

const Medal: React.FC<MedalProps> = ({
  type = null,
  style = {},
  height = '80px',
  width = '80px'
}) => {
  const COLOR_BY_MEDAL: Record<string, string> = {
    RADIANTE: '#FF00B6',
    INMORTAL: '#FF4242',
    DIAMANTE: '#30E3F1',
    PLATINIUM: '#E5E4E2',
    ORO: '#FFD700',
    PLATA: '#C0C0C0',
    BRONCE: '#CD7F32',
    HIERRO: '#43464B',
    MADERA: '#975627',
  };

  const DEFAULT_COLOR = COLOR_BY_MEDAL.MADERA;
  const color = type ? COLOR_BY_MEDAL[type] ?? DEFAULT_COLOR : DEFAULT_COLOR;

  return (
    <svg
      fill="#000000" height={height} width={width}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 299.667 299.667"
      xmlSpace="preserve"
      style={style}
    >
      <g>
        <path style={{ fill: color }} d="M215.501,100.291V10.333c0-5.523-4.145-10.333-9.667-10.333h-23.333v84.688C194.501,88.107,205.501,93.356,215.501,100.291z"/>
        <path style={{ fill: color }} d="M116.501,0H92.834c-5.523,0-10.333,4.811-10.333,10.333v90.646c11-7.278,22-12.759,34-16.291V0z"/>
        <path style={{ fill: color }} d="M149.833,94.999C93.317,94.999,47.5,140.815,47.5,197.333s45.816,102.334,102.332,102.334
          c56.518,0,102.334-45.816,102.334-102.334S206.35,94.999,149.833,94.999z M149.833,278.96c-45.008,0-81.625-36.617-81.625-81.627
          s36.617-81.627,81.625-81.627c45.009,0,81.627,36.617,81.627,81.627S194.841,278.96,149.833,278.96z"/>
        <path style={{ fill: color }} d="M149.833,130.706c-36.736,0-66.625,29.889-66.625,66.627s29.889,66.627,66.625,66.627
          c36.738,0,66.627-29.889,66.627-66.627S186.571,130.706,149.833,130.706z M164.833,240h-31c-4.143,0-7.5-3.357-7.5-7.5
          s3.357-7.5,7.5-7.5h8.667v-27.311c-13-3.177-23.504-15.52-23.504-30.023c0-4.143,3.524-7.666,7.666-7.666h46.344
          c4.143,0,7.333,3.523,7.333,7.666c0,14.145-9.839,26.245-22.839,29.774V225h7.333c4.143,0,7.5,3.357,7.5,7.5
          S168.976,240,164.833,240z"/>
      </g>
    </svg>
  );
}

export default Medal;