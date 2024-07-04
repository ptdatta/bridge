import React from "react";
import { ConnectorProps } from "../types/types";


const Connector: React.FC<ConnectorProps> = ({ connected }) => {
  return (
    <div className="w-36 h-[350px] flex items-center justify-center">
      <svg className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={connected ? 8 : 0} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="110" cy="30" r="20" fill={connected ? "#fff" : "#2a2f36"} filter="url(#glow)" />

        <path
          d="M 110,30 
           L 110,160 
           Q 110,180 90,180
           Q 70,180 70,160
           Q 70,140 50,140
           Q 30,140 30,160
           L 30,320"
          fill="transparent"
          stroke={connected ? "#fff" : "#2a2f36"}
          strokeWidth="20"
          filter="url(#glow)"
        />

        <circle cx="30" cy="320" r="20" fill={connected ? "#fff" : "#2a2f36"} filter="url(#glow)" />
        <circle cx="30" cy="320" r="10" fill={connected ? "#63E6BE" : "#39424f"} />
        <circle cx="110" cy="30" r="10" fill={connected ? "#63E6BE" : "#39424f"} />
      </svg>
    </div>
  );
};

export default Connector;
