import React, { useId } from "react";

type LogoProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export default function Logo({
  width = 540,
  height = 110,
  className,
  ...props
}: LogoProps) {
  const filterId = useId(); // evita conflictos de ID

  return (
    <svg
    //the actual size of the logo//
      viewBox="0 0 405 110"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text
        x={18}
        y={85}
        fontFamily="Palatino Linotype, Palatino, Book Antiqua, Garamond, Georgia, serif"
        fontSize={88}
        fontWeight={300}
        fill="currentColor"
        letterSpacing={1}
        filter={`url(#${filterId})`}
      >
        Núcle
      </text>

      <circle
        cx={370}
        cy={53}
        r={33}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        filter={`url(#${filterId})`}
      />

      <circle
        cx={370}
        cy={53}
        r={14}
        fill="currentColor"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}