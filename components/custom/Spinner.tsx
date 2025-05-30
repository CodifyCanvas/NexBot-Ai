import React from "react";

type SpinnerProps = {
  className?: string;
  variant?: "default" | "gradient" | "blue-gradient";
};

const Spinner: React.FC<SpinnerProps> = ({ className = "", variant = "default" }) => {
  const isGradient = variant === "gradient" || variant === "blue-gradient";

  return (
    <>
      <style jsx>{`
        .spinner-container {
          width: 1em;
          transform-origin: center;
          animation: rotate4 2s linear infinite;
        }

        .spinner-loader {
          fill: none;
          stroke-width: 10;
          stroke-dasharray: 2, 200;
          stroke-dashoffset: 0;
          stroke-linecap: round;
          animation: dash4 1.5s ease-in-out infinite;
        }

        .loader-default {
          stroke: #fff;
        }

        @keyframes rotate4 {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash4 {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 200;
            stroke-dashoffset: -35px;
          }
          100% {
            stroke-dashoffset: -125px;
          }
        }
      `}</style>

      <svg viewBox="25 25 50 50" className={`spinner-container ${className}`}>
        {isGradient && (
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {variant === "gradient" && (
                <>
                  <stop offset="0%" stopColor="oklch(63.48% 0.108 16.10)" />
                  <stop offset="100%" stopColor="oklch(55.92% 0.257 315.94)" />
                </>
              )}
              {variant === "blue-gradient" && (
                <>
                  <stop offset="0%" stopColor="oklch(0.6927 0.1494 261.72)" />
                  <stop offset="100%" stopColor="oklch(0.541 0.1598 259.83)" />
                </>
              )}
            </linearGradient>
          </defs>
        )}

        <circle
          cx="50"
          cy="50"
          r="20"
          className={`spinner-loader ${variant === "default" ? "loader-default" : ""}`}
          stroke={isGradient ? "url(#spinnerGradient)" : undefined}
        />
      </svg>
    </>
  );
};

export default Spinner;
