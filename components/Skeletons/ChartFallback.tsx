export function SmallChartSkeleton() {
  return (
    <div className="w-full h-44 bg-gray-100 dark:bg-white/10 rounded-md p-6 animate-pulse relative overflow-hidden">
      {/* Title placeholder */}
      <div className="w-32 h-4 bg-gray-300 dark:bg-white/10 rounded mb-6" />

      {/* Simulated line path */}
      <svg className="w-full h-28" viewBox="0 0 400 160" fill="none">
        <path
          d="M0 120 C 50 100, 100 80, 150 90 S 250 110, 300 70 S 350 50, 400 60"
          stroke="rgba(156, 163, 175, 0.5)"
          strokeWidth="2"
          fill="none"
        />
        {/* Simulated dots */}
        {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((cx, i) => (
          <circle
            key={i}
            cx={cx}
            cy={Math.random() * 40 + 60}
            r="4"
            fill="rgba(156, 163, 175, 0.6)"
          />
        ))}
      </svg>
    </div>
  );
}
